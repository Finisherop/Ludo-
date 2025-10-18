// Ludo Game Logic
export type PlayerColor = "red" | "green" | "yellow" | "blue";
export type PawnPosition = number; // -1 for home, 0-57 for board path, 58 for finished

export interface Pawn {
  id: number;
  position: PawnPosition;
  isFinished: boolean;
}

export interface Player {
  id: number;
  color: PlayerColor;
  name: string;
  pawns: Pawn[];
  isComputer: boolean;
  isWinner: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number;
  isRolling: boolean;
  consecutiveSixes: number;
  gamePhase: "rolling" | "moving" | "finished";
  winner: Player | null;
}

// Board configuration
export const BOARD_SIZE = 15;
export const TOTAL_POSITIONS = 58;
export const PLAYER_COLORS: PlayerColor[] = ["red", "green", "yellow", "blue"];

// Safe positions on the board (where pawns cannot be captured)
export const SAFE_POSITIONS = [1, 9, 14, 22, 27, 35, 40, 48];

// Starting positions for each color
export const START_POSITIONS = {
  red: 1,
  green: 14,
  yellow: 27,
  blue: 40
};

// Home stretch starting positions (last 6 positions before finish)
export const HOME_STRETCH_START = {
  red: 52,
  green: 52 + 13,
  yellow: 52 + 26,
  blue: 52 + 39
};

// Get the actual board position for a pawn based on its color and step count
export function getBoardPosition(color: PlayerColor, steps: number): number {
  if (steps === -1) return -1; // Home
  if (steps >= 58) return 58; // Finished
  
  const startPos = START_POSITIONS[color];
  
  // Regular path (0-51)
  if (steps <= 51) {
    return (startPos + steps - 1) % 52;
  }
  
  // Home stretch (52-57)
  const homeStretchPos = steps - 52;
  return 52 + (color === "red" ? 0 : color === "green" ? 6 : color === "yellow" ? 12 : 18) + homeStretchPos;
}

// Check if a pawn can move with the given dice value
export function canMovePawn(pawn: Pawn, diceValue: number): boolean {
  if (pawn.isFinished) return false;
  
  // Pawn at home can only move with 6
  if (pawn.position === -1) {
    return diceValue === 6;
  }
  
  // Check if move would exceed finish line
  const newPosition = pawn.position + diceValue;
  return newPosition <= 58;
}

// Get all movable pawns for current player
export function getMovablePawns(player: Player, diceValue: number): number[] {
  return player.pawns
    .map((pawn, index) => ({ pawn, index }))
    .filter(({ pawn }) => canMovePawn(pawn, diceValue))
    .map(({ index }) => index);
}

// Check if position is safe from capture
export function isSafePosition(position: number): boolean {
  if (position === -1 || position === 58) return true;
  return SAFE_POSITIONS.includes(position % 52);
}

// Move a pawn and handle captures
export function movePawn(
  gameState: GameState, 
  playerIndex: number, 
  pawnIndex: number
): GameState {
  const player = gameState.players[playerIndex];
  const pawn = player.pawns[pawnIndex];
  const diceValue = gameState.diceValue;
  
  if (!canMovePawn(pawn, diceValue)) {
    return gameState;
  }
  
  // Calculate new position
  let newPosition: number;
  if (pawn.position === -1) {
    newPosition = 0; // Enter the board
  } else {
    newPosition = pawn.position + diceValue;
  }
  
  // Create new game state
  const newPlayers = gameState.players.map((p, pIndex) => {
    if (pIndex === playerIndex) {
      // Update the moved pawn
      const newPawns = p.pawns.map((pawnItem, pawnIdx) => {
        if (pawnIdx === pawnIndex) {
          return {
            ...pawnItem,
            position: newPosition,
            isFinished: newPosition === 58
          };
        }
        return pawnItem;
      });
      
      // Check if player won
      const isWinner = newPawns.every(pawnItem => pawnItem.isFinished);
      
      return {
        ...p,
        pawns: newPawns,
        isWinner
      };
    } else {
      // Check for captures on other players
      if (newPosition > 0 && newPosition < 58 && !isSafePosition(newPosition)) {
        const capturedPawns = p.pawns.map(pawnItem => {
          const pawnBoardPos = getBoardPosition(p.color, pawnItem.position);
          const newPawnBoardPos = getBoardPosition(player.color, newPosition);
          
          if (pawnBoardPos === newPawnBoardPos && pawnItem.position > 0) {
            return { ...pawnItem, position: -1 }; // Send home
          }
          return pawnItem;
        });
        
        return { ...p, pawns: capturedPawns };
      }
    }
    return p;
  });
  
  // Check for winner
  const winner = newPlayers.find(p => p.isWinner) || null;
  
  // Determine next turn
  const shouldContinueTurn = diceValue === 6 && gameState.consecutiveSixes < 2 && !winner;
  const nextPlayerIndex = shouldContinueTurn 
    ? playerIndex 
    : (playerIndex + 1) % gameState.players.length;
  
  return {
    ...gameState,
    players: newPlayers,
    currentPlayerIndex: nextPlayerIndex,
    gamePhase: winner ? "finished" : "rolling",
    winner,
    consecutiveSixes: shouldContinueTurn ? gameState.consecutiveSixes : 0
  };
}

// Simple AI for computer players
export function getComputerMove(player: Player, diceValue: number): number {
  const movablePawns = getMovablePawns(player, diceValue);
  
  if (movablePawns.length === 0) return -1;
  
  // AI Strategy (in order of priority):
  // 1. Move pawn out of home if possible (dice = 6)
  // 2. Move pawn closest to finish
  // 3. Move pawn that can capture opponent
  // 4. Move any available pawn
  
  // Priority 1: Move pawn out of home
  const homePawns = movablePawns.filter(index => player.pawns[index].position === -1);
  if (homePawns.length > 0 && diceValue === 6) {
    return homePawns[0];
  }
  
  // Priority 2: Move pawn closest to finish
  const boardPawns = movablePawns.filter(index => player.pawns[index].position > -1);
  if (boardPawns.length > 0) {
    boardPawns.sort((a, b) => player.pawns[b].position - player.pawns[a].position);
    return boardPawns[0];
  }
  
  // Fallback: move first available pawn
  return movablePawns[0];
}

// Initialize a new game
export function initializeGame(numPlayers: number, mode: "computer" | "local"): GameState {
  const players: Player[] = [];
  
  for (let i = 0; i < numPlayers; i++) {
    const color = PLAYER_COLORS[i];
    const isComputer = mode === "computer" && i > 0;
    
    players.push({
      id: i,
      color,
      name: isComputer ? `Computer ${i}` : `Player ${i + 1}`,
      pawns: Array.from({ length: 4 }, (_, pawnId) => ({
        id: pawnId,
        position: -1,
        isFinished: false
      })),
      isComputer,
      isWinner: false
    });
  }
  
  return {
    players,
    currentPlayerIndex: 0,
    diceValue: 0,
    isRolling: false,
    consecutiveSixes: 0,
    gamePhase: "rolling",
    winner: null
  };
}

// Get board cell coordinates for rendering
export function getBoardCellCoordinates(position: number): { x: number; y: number } {
  // This is a simplified mapping - in a real implementation, 
  // you'd have exact coordinates for each position on the Ludo board
  const row = Math.floor(position / 13);
  const col = position % 13;
  
  return {
    x: col * 6 + 10,
    y: row * 6 + 10
  };
}

// Check if game is over
export function isGameOver(gameState: GameState): boolean {
  return gameState.winner !== null;
}

// Get game statistics
export function getGameStats(gameState: GameState) {
  return gameState.players.map(player => ({
    name: player.name,
    color: player.color,
    finishedPawns: player.pawns.filter(p => p.isFinished).length,
    isWinner: player.isWinner
  }));
}
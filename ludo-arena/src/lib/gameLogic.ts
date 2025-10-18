import { GameState, Player, Pawn, PlayerColor, BoardPosition } from '@/types/game';

// Board positions for each color's path
const BOARD_POSITIONS: Record<PlayerColor, BoardPosition[]> = {
  red: [
    { x: 1, y: 6, isSafe: true, isHomePath: false, color: 'red' },
    { x: 2, y: 6, isSafe: false, isHomePath: false },
    { x: 3, y: 6, isSafe: false, isHomePath: false },
    { x: 4, y: 6, isSafe: false, isHomePath: false },
    { x: 5, y: 6, isSafe: false, isHomePath: false },
    { x: 6, y: 5, isSafe: false, isHomePath: false },
    { x: 6, y: 4, isSafe: false, isHomePath: false },
    { x: 6, y: 3, isSafe: false, isHomePath: false },
    { x: 6, y: 2, isSafe: false, isHomePath: false },
    { x: 6, y: 1, isSafe: false, isHomePath: false },
    { x: 7, y: 1, isSafe: false, isHomePath: false },
    { x: 8, y: 1, isSafe: false, isHomePath: false },
    { x: 8, y: 2, isSafe: false, isHomePath: false },
    { x: 8, y: 3, isSafe: false, isHomePath: false },
    { x: 8, y: 4, isSafe: false, isHomePath: false },
    { x: 8, y: 5, isSafe: false, isHomePath: false },
    { x: 8, y: 6, isSafe: false, isHomePath: false },
    { x: 9, y: 6, isSafe: false, isHomePath: false },
    { x: 10, y: 6, isSafe: false, isHomePath: false },
    { x: 11, y: 6, isSafe: false, isHomePath: false },
    { x: 12, y: 6, isSafe: false, isHomePath: false },
    { x: 12, y: 7, isSafe: false, isHomePath: false },
    { x: 12, y: 8, isSafe: false, isHomePath: false },
    { x: 11, y: 8, isSafe: false, isHomePath: false },
    { x: 10, y: 8, isSafe: false, isHomePath: false },
    { x: 9, y: 8, isSafe: false, isHomePath: false },
    { x: 8, y: 8, isSafe: false, isHomePath: false },
    { x: 8, y: 9, isSafe: false, isHomePath: false },
    { x: 8, y: 10, isSafe: false, isHomePath: false },
    { x: 8, y: 11, isSafe: false, isHomePath: false },
    { x: 8, y: 12, isSafe: false, isHomePath: false },
    { x: 7, y: 12, isSafe: false, isHomePath: false },
    { x: 6, y: 12, isSafe: false, isHomePath: false },
    { x: 6, y: 11, isSafe: false, isHomePath: false },
    { x: 6, y: 10, isSafe: false, isHomePath: false },
    { x: 6, y: 9, isSafe: false, isHomePath: false },
    { x: 6, y: 8, isSafe: false, isHomePath: false },
    { x: 5, y: 8, isSafe: false, isHomePath: false },
    { x: 4, y: 8, isSafe: false, isHomePath: false },
    { x: 3, y: 8, isSafe: false, isHomePath: false },
    { x: 2, y: 8, isSafe: false, isHomePath: false },
    { x: 1, y: 8, isSafe: false, isHomePath: false },
    { x: 1, y: 9, isSafe: false, isHomePath: false },
    { x: 1, y: 10, isSafe: false, isHomePath: false },
    { x: 1, y: 11, isSafe: false, isHomePath: false },
    { x: 1, y: 12, isSafe: false, isHomePath: false },
    { x: 2, y: 12, isSafe: false, isHomePath: false },
    { x: 3, y: 12, isSafe: false, isHomePath: false },
    { x: 4, y: 12, isSafe: false, isHomePath: false },
    { x: 5, y: 12, isSafe: false, isHomePath: false },
    { x: 6, y: 12, isSafe: false, isHomePath: false },
    { x: 6, y: 11, isSafe: false, isHomePath: false },
    { x: 6, y: 10, isSafe: false, isHomePath: false },
    { x: 6, y: 9, isSafe: false, isHomePath: false },
    { x: 6, y: 8, isSafe: false, isHomePath: false },
    { x: 6, y: 7, isSafe: false, isHomePath: false },
    { x: 6, y: 6, isSafe: true, isHomePath: true, color: 'red' },
    { x: 6, y: 5, isSafe: true, isHomePath: true, color: 'red' },
    { x: 6, y: 4, isSafe: true, isHomePath: true, color: 'red' },
    { x: 6, y: 3, isSafe: true, isHomePath: true, color: 'red' },
    { x: 6, y: 2, isSafe: true, isHomePath: true, color: 'red' },
    { x: 6, y: 1, isSafe: true, isHomePath: true, color: 'red' },
  ],
  blue: [
    { x: 7, y: 1, isSafe: true, isHomePath: false, color: 'blue' },
    { x: 7, y: 2, isSafe: false, isHomePath: false },
    { x: 7, y: 3, isSafe: false, isHomePath: false },
    { x: 7, y: 4, isSafe: false, isHomePath: false },
    { x: 7, y: 5, isSafe: false, isHomePath: false },
    { x: 6, y: 5, isSafe: false, isHomePath: false },
    { x: 5, y: 5, isSafe: false, isHomePath: false },
    { x: 4, y: 5, isSafe: false, isHomePath: false },
    { x: 3, y: 5, isSafe: false, isHomePath: false },
    { x: 2, y: 5, isSafe: false, isHomePath: false },
    { x: 1, y: 5, isSafe: false, isHomePath: false },
    { x: 1, y: 4, isSafe: false, isHomePath: false },
    { x: 1, y: 3, isSafe: false, isHomePath: false },
    { x: 2, y: 3, isSafe: false, isHomePath: false },
    { x: 3, y: 3, isSafe: false, isHomePath: false },
    { x: 4, y: 3, isSafe: false, isHomePath: false },
    { x: 5, y: 3, isSafe: false, isHomePath: false },
    { x: 6, y: 3, isSafe: false, isHomePath: false },
    { x: 6, y: 2, isSafe: false, isHomePath: false },
    { x: 6, y: 1, isSafe: false, isHomePath: false },
    { x: 7, y: 1, isSafe: false, isHomePath: false },
    { x: 8, y: 1, isSafe: false, isHomePath: false },
    { x: 9, y: 1, isSafe: false, isHomePath: false },
    { x: 10, y: 1, isSafe: false, isHomePath: false },
    { x: 11, y: 1, isSafe: false, isHomePath: false },
    { x: 12, y: 1, isSafe: false, isHomePath: false },
    { x: 12, y: 2, isSafe: false, isHomePath: false },
    { x: 12, y: 3, isSafe: false, isHomePath: false },
    { x: 11, y: 3, isSafe: false, isHomePath: false },
    { x: 10, y: 3, isSafe: false, isHomePath: false },
    { x: 9, y: 3, isSafe: false, isHomePath: false },
    { x: 8, y: 3, isSafe: false, isHomePath: false },
    { x: 8, y: 4, isSafe: false, isHomePath: false },
    { x: 8, y: 5, isSafe: false, isHomePath: false },
    { x: 8, y: 6, isSafe: false, isHomePath: false },
    { x: 8, y: 7, isSafe: false, isHomePath: false },
    { x: 8, y: 8, isSafe: false, isHomePath: false },
    { x: 8, y: 9, isSafe: false, isHomePath: false },
    { x: 8, y: 10, isSafe: false, isHomePath: false },
    { x: 8, y: 11, isSafe: false, isHomePath: false },
    { x: 8, y: 12, isSafe: false, isHomePath: false },
    { x: 7, y: 12, isSafe: false, isHomePath: false },
    { x: 6, y: 12, isSafe: false, isHomePath: false },
    { x: 5, y: 12, isSafe: false, isHomePath: false },
    { x: 4, y: 12, isSafe: false, isHomePath: false },
    { x: 3, y: 12, isSafe: false, isHomePath: false },
    { x: 2, y: 12, isSafe: false, isHomePath: false },
    { x: 1, y: 12, isSafe: false, isHomePath: false },
    { x: 1, y: 11, isSafe: false, isHomePath: false },
    { x: 1, y: 10, isSafe: false, isHomePath: false },
    { x: 1, y: 9, isSafe: false, isHomePath: false },
    { x: 1, y: 8, isSafe: false, isHomePath: false },
    { x: 1, y: 7, isSafe: false, isHomePath: false },
    { x: 1, y: 6, isSafe: false, isHomePath: false },
    { x: 1, y: 5, isSafe: false, isHomePath: false },
    { x: 1, y: 4, isSafe: false, isHomePath: false },
    { x: 1, y: 3, isSafe: false, isHomePath: false },
    { x: 1, y: 2, isSafe: false, isHomePath: false },
    { x: 1, y: 1, isSafe: false, isHomePath: false },
    { x: 2, y: 1, isSafe: false, isHomePath: false },
    { x: 3, y: 1, isSafe: false, isHomePath: false },
    { x: 4, y: 1, isSafe: false, isHomePath: false },
    { x: 5, y: 1, isSafe: false, isHomePath: false },
    { x: 6, y: 1, isSafe: false, isHomePath: false },
    { x: 7, y: 1, isSafe: true, isHomePath: true, color: 'blue' },
    { x: 7, y: 2, isSafe: true, isHomePath: true, color: 'blue' },
    { x: 7, y: 3, isSafe: true, isHomePath: true, color: 'blue' },
    { x: 7, y: 4, isSafe: true, isHomePath: true, color: 'blue' },
    { x: 7, y: 5, isSafe: true, isHomePath: true, color: 'blue' },
    { x: 7, y: 6, isSafe: true, isHomePath: true, color: 'blue' },
  ],
  green: [
    { x: 12, y: 7, isSafe: true, isHomePath: false, color: 'green' },
    { x: 11, y: 7, isSafe: false, isHomePath: false },
    { x: 10, y: 7, isSafe: false, isHomePath: false },
    { x: 9, y: 7, isSafe: false, isHomePath: false },
    { x: 8, y: 7, isSafe: false, isHomePath: false },
    { x: 8, y: 6, isSafe: false, isHomePath: false },
    { x: 8, y: 5, isSafe: false, isHomePath: false },
    { x: 8, y: 4, isSafe: false, isHomePath: false },
    { x: 8, y: 3, isSafe: false, isHomePath: false },
    { x: 8, y: 2, isSafe: false, isHomePath: false },
    { x: 8, y: 1, isSafe: false, isHomePath: false },
    { x: 9, y: 1, isSafe: false, isHomePath: false },
    { x: 10, y: 1, isSafe: false, isHomePath: false },
    { x: 10, y: 2, isSafe: false, isHomePath: false },
    { x: 10, y: 3, isSafe: false, isHomePath: false },
    { x: 10, y: 4, isSafe: false, isHomePath: false },
    { x: 10, y: 5, isSafe: false, isHomePath: false },
    { x: 10, y: 6, isSafe: false, isHomePath: false },
    { x: 10, y: 7, isSafe: false, isHomePath: false },
    { x: 10, y: 8, isSafe: false, isHomePath: false },
    { x: 10, y: 9, isSafe: false, isHomePath: false },
    { x: 10, y: 10, isSafe: false, isHomePath: false },
    { x: 10, y: 11, isSafe: false, isHomePath: false },
    { x: 10, y: 12, isSafe: false, isHomePath: false },
    { x: 11, y: 12, isSafe: false, isHomePath: false },
    { x: 12, y: 12, isSafe: false, isHomePath: false },
    { x: 12, y: 11, isSafe: false, isHomePath: false },
    { x: 11, y: 11, isSafe: false, isHomePath: false },
    { x: 10, y: 11, isSafe: false, isHomePath: false },
    { x: 9, y: 11, isSafe: false, isHomePath: false },
    { x: 8, y: 11, isSafe: false, isHomePath: false },
    { x: 8, y: 10, isSafe: false, isHomePath: false },
    { x: 8, y: 9, isSafe: false, isHomePath: false },
    { x: 8, y: 8, isSafe: false, isHomePath: false },
    { x: 8, y: 7, isSafe: false, isHomePath: false },
    { x: 8, y: 6, isSafe: false, isHomePath: false },
    { x: 8, y: 5, isSafe: false, isHomePath: false },
    { x: 8, y: 4, isSafe: false, isHomePath: false },
    { x: 8, y: 3, isSafe: false, isHomePath: false },
    { x: 8, y: 2, isSafe: false, isHomePath: false },
    { x: 8, y: 1, isSafe: false, isHomePath: false },
    { x: 7, y: 1, isSafe: false, isHomePath: false },
    { x: 6, y: 1, isSafe: false, isHomePath: false },
    { x: 5, y: 1, isSafe: false, isHomePath: false },
    { x: 4, y: 1, isSafe: false, isHomePath: false },
    { x: 3, y: 1, isSafe: false, isHomePath: false },
    { x: 2, y: 1, isSafe: false, isHomePath: false },
    { x: 1, y: 1, isSafe: false, isHomePath: false },
    { x: 1, y: 2, isSafe: false, isHomePath: false },
    { x: 1, y: 3, isSafe: false, isHomePath: false },
    { x: 1, y: 4, isSafe: false, isHomePath: false },
    { x: 1, y: 5, isSafe: false, isHomePath: false },
    { x: 1, y: 6, isSafe: false, isHomePath: false },
    { x: 1, y: 7, isSafe: false, isHomePath: false },
    { x: 1, y: 8, isSafe: false, isHomePath: false },
    { x: 1, y: 9, isSafe: false, isHomePath: false },
    { x: 1, y: 10, isSafe: false, isHomePath: false },
    { x: 1, y: 11, isSafe: false, isHomePath: false },
    { x: 1, y: 12, isSafe: false, isHomePath: false },
    { x: 2, y: 12, isSafe: false, isHomePath: false },
    { x: 3, y: 12, isSafe: false, isHomePath: false },
    { x: 4, y: 12, isSafe: false, isHomePath: false },
    { x: 5, y: 12, isSafe: false, isHomePath: false },
    { x: 6, y: 12, isSafe: false, isHomePath: false },
    { x: 7, y: 12, isSafe: false, isHomePath: false },
    { x: 8, y: 12, isSafe: false, isHomePath: false },
    { x: 9, y: 12, isSafe: false, isHomePath: false },
    { x: 10, y: 12, isSafe: false, isHomePath: false },
    { x: 11, y: 12, isSafe: false, isHomePath: false },
    { x: 12, y: 12, isSafe: false, isHomePath: false },
    { x: 12, y: 11, isSafe: false, isHomePath: false },
    { x: 12, y: 10, isSafe: false, isHomePath: false },
    { x: 12, y: 9, isSafe: false, isHomePath: false },
    { x: 12, y: 8, isSafe: false, isHomePath: false },
    { x: 12, y: 7, isSafe: true, isHomePath: true, color: 'green' },
    { x: 12, y: 6, isSafe: true, isHomePath: true, color: 'green' },
    { x: 12, y: 5, isSafe: true, isHomePath: true, color: 'green' },
    { x: 12, y: 4, isSafe: true, isHomePath: true, color: 'green' },
    { x: 12, y: 3, isSafe: true, isHomePath: true, color: 'green' },
    { x: 12, y: 2, isSafe: true, isHomePath: true, color: 'green' },
  ],
  yellow: [
    { x: 6, y: 12, isSafe: true, isHomePath: false, color: 'yellow' },
    { x: 6, y: 11, isSafe: false, isHomePath: false },
    { x: 6, y: 10, isSafe: false, isHomePath: false },
    { x: 6, y: 9, isSafe: false, isHomePath: false },
    { x: 6, y: 8, isSafe: false, isHomePath: false },
    { x: 5, y: 8, isSafe: false, isHomePath: false },
    { x: 4, y: 8, isSafe: false, isHomePath: false },
    { x: 3, y: 8, isSafe: false, isHomePath: false },
    { x: 2, y: 8, isSafe: false, isHomePath: false },
    { x: 1, y: 8, isSafe: false, isHomePath: false },
    { x: 1, y: 7, isSafe: false, isHomePath: false },
    { x: 1, y: 6, isSafe: false, isHomePath: false },
    { x: 2, y: 6, isSafe: false, isHomePath: false },
    { x: 3, y: 6, isSafe: false, isHomePath: false },
    { x: 4, y: 6, isSafe: false, isHomePath: false },
    { x: 5, y: 6, isSafe: false, isHomePath: false },
    { x: 6, y: 6, isSafe: false, isHomePath: false },
    { x: 6, y: 5, isSafe: false, isHomePath: false },
    { x: 6, y: 4, isSafe: false, isHomePath: false },
    { x: 6, y: 3, isSafe: false, isHomePath: false },
    { x: 6, y: 2, isSafe: false, isHomePath: false },
    { x: 6, y: 1, isSafe: false, isHomePath: false },
    { x: 7, y: 1, isSafe: false, isHomePath: false },
    { x: 8, y: 1, isSafe: false, isHomePath: false },
    { x: 9, y: 1, isSafe: false, isHomePath: false },
    { x: 10, y: 1, isSafe: false, isHomePath: false },
    { x: 11, y: 1, isSafe: false, isHomePath: false },
    { x: 12, y: 1, isSafe: false, isHomePath: false },
    { x: 12, y: 2, isSafe: false, isHomePath: false },
    { x: 12, y: 3, isSafe: false, isHomePath: false },
    { x: 11, y: 3, isSafe: false, isHomePath: false },
    { x: 10, y: 3, isSafe: false, isHomePath: false },
    { x: 9, y: 3, isSafe: false, isHomePath: false },
    { x: 8, y: 3, isSafe: false, isHomePath: false },
    { x: 8, y: 4, isSafe: false, isHomePath: false },
    { x: 8, y: 5, isSafe: false, isHomePath: false },
    { x: 8, y: 6, isSafe: false, isHomePath: false },
    { x: 8, y: 7, isSafe: false, isHomePath: false },
    { x: 8, y: 8, isSafe: false, isHomePath: false },
    { x: 8, y: 9, isSafe: false, isHomePath: false },
    { x: 8, y: 10, isSafe: false, isHomePath: false },
    { x: 8, y: 11, isSafe: false, isHomePath: false },
    { x: 8, y: 12, isSafe: false, isHomePath: false },
    { x: 7, y: 12, isSafe: false, isHomePath: false },
    { x: 6, y: 12, isSafe: false, isHomePath: false },
    { x: 5, y: 12, isSafe: false, isHomePath: false },
    { x: 4, y: 12, isSafe: false, isHomePath: false },
    { x: 3, y: 12, isSafe: false, isHomePath: false },
    { x: 2, y: 12, isSafe: false, isHomePath: false },
    { x: 1, y: 12, isSafe: false, isHomePath: false },
    { x: 1, y: 11, isSafe: false, isHomePath: false },
    { x: 1, y: 10, isSafe: false, isHomePath: false },
    { x: 1, y: 9, isSafe: false, isHomePath: false },
    { x: 1, y: 8, isSafe: false, isHomePath: false },
    { x: 1, y: 7, isSafe: false, isHomePath: false },
    { x: 1, y: 6, isSafe: false, isHomePath: false },
    { x: 1, y: 5, isSafe: false, isHomePath: false },
    { x: 1, y: 4, isSafe: false, isHomePath: false },
    { x: 1, y: 3, isSafe: false, isHomePath: false },
    { x: 1, y: 2, isSafe: false, isHomePath: false },
    { x: 1, y: 1, isSafe: false, isHomePath: false },
    { x: 2, y: 1, isSafe: false, isHomePath: false },
    { x: 3, y: 1, isSafe: false, isHomePath: false },
    { x: 4, y: 1, isSafe: false, isHomePath: false },
    { x: 5, y: 1, isSafe: false, isHomePath: false },
    { x: 6, y: 1, isSafe: false, isHomePath: false },
    { x: 6, y: 2, isSafe: false, isHomePath: false },
    { x: 6, y: 3, isSafe: false, isHomePath: false },
    { x: 6, y: 4, isSafe: false, isHomePath: false },
    { x: 6, y: 5, isSafe: false, isHomePath: false },
    { x: 6, y: 6, isSafe: false, isHomePath: false },
    { x: 6, y: 7, isSafe: false, isHomePath: false },
    { x: 6, y: 8, isSafe: false, isHomePath: false },
    { x: 6, y: 9, isSafe: false, isHomePath: false },
    { x: 6, y: 10, isSafe: false, isHomePath: false },
    { x: 6, y: 11, isSafe: false, isHomePath: false },
    { x: 6, y: 12, isSafe: true, isHomePath: true, color: 'yellow' },
    { x: 6, y: 11, isSafe: true, isHomePath: true, color: 'yellow' },
    { x: 6, y: 10, isSafe: true, isHomePath: true, color: 'yellow' },
    { x: 6, y: 9, isSafe: true, isHomePath: true, color: 'yellow' },
    { x: 6, y: 8, isSafe: true, isHomePath: true, color: 'yellow' },
    { x: 6, y: 7, isSafe: true, isHomePath: true, color: 'yellow' },
  ],
};

// Safe positions on the board
const SAFE_POSITIONS = [1, 8, 13, 21, 26, 34, 39, 47];

export function createInitialGameState(mode: 'computer' | 'local', numPlayers: number): GameState {
  const colors: PlayerColor[] = ['red', 'blue', 'green', 'yellow'];
  const players: Player[] = [];

  for (let i = 0; i < numPlayers; i++) {
    const color = colors[i];
    const pawns: Pawn[] = Array.from({ length: 4 }, (_, index) => ({
      id: index,
      color,
      position: 0,
      isHome: true,
      isInPlay: false,
    }));

    players.push({
      id: i,
      color,
      name: mode === 'computer' && i > 0 ? `Computer ${i}` : `Player ${i + 1}`,
      pawns,
      isActive: i === 0,
      isComputer: mode === 'computer' && i > 0,
    });
  }

  return {
    players,
    currentPlayerIndex: 0,
    diceValue: 0,
    gameMode: mode,
    winner: null,
    isGameOver: false,
    consecutiveSixes: 0,
    canRollDice: true,
  };
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function getValidMoves(gameState: GameState, pawn: Pawn): boolean {
  if (gameState.diceValue === 0) return false;
  
  // Pawn must be out of home to move
  if (pawn.position === 0 && gameState.diceValue !== 6) return false;
  
  // If pawn is in home and dice is 6, it can come out
  if (pawn.position === 0 && gameState.diceValue === 6) return true;
  
  // Check if move would exceed home path
  const newPosition = pawn.position + gameState.diceValue;
  if (newPosition > 57) return false;
  
  return true;
}

export function movePawn(gameState: GameState, pawnId: number, playerId: number): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];
  const pawn = player.pawns.find(p => p.id === pawnId);
  
  if (!pawn || !getValidMoves(gameState, pawn)) return gameState;
  
  // Handle pawn coming out of home
  if (pawn.position === 0 && gameState.diceValue === 6) {
    pawn.position = 1;
    pawn.isInPlay = true;
    pawn.isHome = false;
  } else if (pawn.position > 0) {
    // Move pawn
    const newPosition = pawn.position + gameState.diceValue;
    
    // Check for capture
    const capturedPawn = checkCapture(newState, pawn, newPosition);
    if (capturedPawn) {
      capturedPawn.position = 0;
      capturedPawn.isInPlay = false;
      capturedPawn.isHome = true;
    }
    
    pawn.position = newPosition;
    
    // Check if pawn reached home
    if (newPosition >= 57) {
      pawn.isHome = true;
      pawn.isInPlay = false;
    }
  }
  
  // Check for win condition
  const allPawnsHome = player.pawns.every(p => p.isHome);
  if (allPawnsHome) {
    newState.winner = player;
    newState.isGameOver = true;
  }
  
  return newState;
}

function checkCapture(gameState: GameState, movingPawn: Pawn, newPosition: number): Pawn | null {
  // Don't capture on safe positions
  if (SAFE_POSITIONS.includes(newPosition)) return null;
  
  // Don't capture on home path
  if (newPosition > 51) return null;
  
  // Check all other players' pawns
  for (const player of gameState.players) {
    if (player.color === movingPawn.color) continue;
    
    for (const pawn of player.pawns) {
      if (pawn.position === newPosition && pawn.isInPlay) {
        return pawn;
      }
    }
  }
  
  return null;
}

export function nextTurn(gameState: GameState): GameState {
  const newState = { ...gameState };
  
  // If dice was 6, give extra turn (max 3)
  if (gameState.diceValue === 6 && gameState.consecutiveSixes < 2) {
    newState.consecutiveSixes = gameState.consecutiveSixes + 1;
    newState.canRollDice = true;
    return newState;
  }
  
  // Reset consecutive sixes and move to next player
  newState.consecutiveSixes = 0;
  newState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  newState.canRollDice = true;
  newState.diceValue = 0;
  
  return newState;
}

export function getBoardPosition(pawn: Pawn): BoardPosition {
  const colorPositions = BOARD_POSITIONS[pawn.color];
  if (pawn.position === 0) {
    // Pawn is in home area
    return { x: 0, y: 0, isSafe: true, isHomePath: false, color: pawn.color };
  }
  
  if (pawn.position > 51) {
    // Pawn is in home path
    return colorPositions[pawn.position - 1];
  }
  
  return colorPositions[pawn.position - 1];
}

export function getComputerMove(gameState: GameState): { pawnId: number } | null {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const validMoves = currentPlayer.pawns.filter(pawn => getValidMoves(gameState, pawn));
  
  if (validMoves.length === 0) return null;
  
  // AI Strategy: Prefer capturing moves, then pawns close to home
  const capturingMoves = validMoves.filter(pawn => {
    const newPosition = pawn.position + gameState.diceValue;
    return newPosition <= 51 && !SAFE_POSITIONS.includes(newPosition) && 
           gameState.players.some(p => p.color !== currentPlayer.color && 
           p.pawns.some(otherPawn => otherPawn.position === newPosition && otherPawn.isInPlay));
  });
  
  if (capturingMoves.length > 0) {
    return { pawnId: capturingMoves[0].id };
  }
  
  // Prefer pawns closer to home
  const sortedMoves = validMoves.sort((a, b) => b.position - a.position);
  return { pawnId: sortedMoves[0].id };
}
export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';

export type GameMode = 'computer' | 'local';

export interface Pawn {
  id: number;
  color: PlayerColor;
  position: number; // 0-57 (0 = home, 1-51 = board, 52-57 = home path)
  isHome: boolean;
  isInPlay: boolean;
}

export interface Player {
  id: number;
  color: PlayerColor;
  name: string;
  pawns: Pawn[];
  isActive: boolean;
  isComputer: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number;
  gameMode: GameMode;
  winner: Player | null;
  isGameOver: boolean;
  consecutiveSixes: number;
  canRollDice: boolean;
}

export interface BoardPosition {
  x: number;
  y: number;
  isSafe: boolean;
  isHomePath: boolean;
  color?: PlayerColor;
}

export interface GameSettings {
  mode: GameMode;
  numPlayers: number;
  musicEnabled: boolean;
}
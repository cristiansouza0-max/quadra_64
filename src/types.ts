export type PieceColor = 'preta' | 'vermelha' | 'amarela' | 'azul' | 'branca';

export interface PieceDef {
  id: string;
  name: string;
  color: PieceColor;
  spaces: number;
  shapeType: 'linha' | 'quadrado' | 'retangulo';
  defaultWidth: number;
  defaultHeight: number;
  isFixed?: boolean;
}

export interface PlacedPiece {
  pieceId: string;
  row: number; // Top-left row
  col: number; // Top-left col
  width: number;
  height: number;
  isFixed?: boolean;
}

export interface CellState {
  row: number;
  col: number;
  pieceId: string | null;
  color: PieceColor | null;
  isFixed: boolean;
}

export type BoardMatrix = (CellState | null)[][];

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeSeconds: number | null;
  currentStreak: number;
  xp?: number;
}

export type GameMode = 'casual' | 'timer' | 'daily';

export interface GameRecord {
  id: string;
  timestamp: number;
  timeSeconds: number;
  hintsUsed: number;
  mode: GameMode;
  won: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

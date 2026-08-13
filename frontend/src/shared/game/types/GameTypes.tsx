// ============================================
// Tipos do jogo de Damas - Feature IA Computador
// ============================================
import type { BoardCell, BoardPosition } from '../../board/types/BoardTypes';

export type PlayerColor = 'white' | 'black';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface GameMove {
  from: BoardPosition;
  to: BoardPosition;
}

export interface AIMove {
  from: BoardPosition;
  to: BoardPosition;
}

export interface GameControlState {
  cells: BoardCell[][];
  currentTurn: PlayerColor;
  humanColor: PlayerColor;
  aiColor: PlayerColor;
  difficulty: AIDifficulty;
  isAiThinking: boolean;
  result: 'playing' | 'human_won' | 'ai_won' | 'draw';
}

export type GameControlActions = {
  handleCellClick: (from: BoardPosition, to: BoardPosition) => void;
  handlePieceDrag: (from: BoardPosition, to: BoardPosition) => void;
  setDifficulty: (difficulty: AIDifficulty) => void;
  setHumanColor: (color: PlayerColor) => void;
  startNewGame: () => void;
};

export interface GameControlReturn {
  state: GameControlState;
  actions: GameControlActions;
}

export interface GameEvaluationInput {
  cells: BoardCell[][];
  aiColor: PlayerColor;
}

export interface AISettings {
  color: PlayerColor;
  difficulty: AIDifficulty;
}

// ============================================
// Tipos de renderização (usados pelos componentes)
// ============================================
export interface RenderPiece {
  type: 'piece';
  value: BoardCell['value'];
  isWhite: boolean;
  isKing: boolean;
  isSelected: boolean;
  onClick: () => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onDragStart: (e: React.DragEvent | React.TouchEvent) => void;
  onDragEnd: (e: React.DragEvent | React.TouchEvent) => void;
}

export interface RenderCell {
  type: 'cell';
  key: string;
  bg: string;
  isPlayable: boolean;
  piece: RenderPiece | null;
  showValidDot: boolean;
  onClick: () => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
}

export interface GameBoardReturn {
  cellsData: RenderCell[];
  pieceCount: number;
  letters: string[];
  numbers: string[];
  selectedCell: BoardPosition | null;
  validMoves: BoardPosition[];
}

export interface OptionItem<T extends string> {
  value: T;
  label: string;
}

export interface GamePresentation {
  difficultyOptions: readonly OptionItem<AIDifficulty>[];
  colorOptions: readonly OptionItem<PlayerColor>[];
  isHumanTurn: boolean;
  resultLabel: string | null;
}


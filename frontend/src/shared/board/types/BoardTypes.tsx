import type { ReactNode } from 'react';

export type CellValue = null | 'white' | 'black' | 'white-king' | 'black-king';

export interface BoardPosition {
  row: number;
  col: number;
}

export interface BoardCell {
  position: BoardPosition;
  value: CellValue;
  isPlayable: boolean;
}

export interface BoardState {
  cells: BoardCell[][];
  selectedCell: BoardPosition | null;
  validMoves: BoardPosition[];
}

export interface BoardActions {
  handleCellClick: (position: BoardPosition) => void;
  handlePieceDrag: (from: BoardPosition, to: BoardPosition) => void;
}

export interface Board2DSceneProps {
  state: BoardState;
  actions: BoardActions;
  cellBg: (row: number, col: number) => string;
  getCellStyle: (row: number, col: number) => { bg: string; isSelected: boolean; isValidMoveTarget: boolean };
}

export interface UseBoardReturn {
  state: BoardState;
  actions: BoardActions;
  cellBg: (row: number, col: number) => string;
  pieceCount: number;
  getCellStyle: (row: number, col: number) => { bg: string; isSelected: boolean; isValidMoveTarget: boolean };
}
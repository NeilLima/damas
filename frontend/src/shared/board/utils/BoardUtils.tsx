'use client';

import { useState, useCallback, useMemo } from 'react';
import { useBoardService } from '../services/BoardServices';
import type { BoardState, BoardActions, BoardPosition, BoardCell, CellValue } from '../types/BoardTypes';

// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const BOARD_SIZE = 8;
const PADDING = 0.5;
const CELL_SIZE = 1;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const NUMBERS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const DARK_CELL = '#8B6914';
const LIGHT_CELL = '#D2B48C';
const SELECTED_CELL = '#4a7c59';
const VALID_MOVE_CELL = '#5a9c6b';

export interface RenderPiece {
  type: 'piece';
  value: CellValue;
  isWhite: boolean;
  isKing: boolean;
  isSelected: boolean;
  onClick: () => void;
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
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
}

// ============================================
// 2️⃣ ESTADOS + 3️⃣ OBJETOS + 4️⃣ FUNÇÕES
// ============================================
export function useBoard(): {
  state: BoardState;
  actions: BoardActions;
  cellsData: RenderCell[];
  pieceCount: number;
  letters: string[];
  numbers: string[];
  draggedPiece: { from: BoardPosition } | null;
  validMoves: BoardPosition[];
} {
  const service = useBoardService();

  const [cells, setCells] = useState<BoardCell[][]>(() => service.initBoard());
  const [selectedCell, setSelectedCell] = useState<BoardPosition | null>(null);
  const [validMoves, setValidMoves] = useState<BoardPosition[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<{ from: BoardPosition } | null>(null);
  const [touchTarget, setTouchTarget] = useState<{ row: number; col: number } | null>(null);

  const pieceCount = useMemo(() => cells.flat().filter((cell) => cell.value !== null).length, [cells]);

  const handleCellClick = useCallback(
    (position: BoardPosition) => {
      setCells((currentCells) => {
        const cell = currentCells[position.row][position.col];
        const pieceColor = cell.value ? service.getPieceColor(cell.value) : null;

        if (selectedCell) {
          if (cell.isPlayable && cell.value === null) {
            const isValid = validMoves.some((m) => m.row === position.row && m.col === position.col);
            if (isValid) {
              const newCells = service.movePiece(currentCells, selectedCell, position);
              setSelectedCell(null);
              setValidMoves([]);
              return newCells;
            }
          }
          setSelectedCell(null);
          setValidMoves([]);
        } else {
          if (cell.value !== null) {
            setSelectedCell(position);
            const moves = service.getValidMoves(currentCells, position, pieceColor);
            setValidMoves(moves);
          }
        }
        return currentCells;
      });
    },
    [selectedCell, validMoves, service],
  );

  const handleMove = useCallback(
    (from: BoardPosition, to: BoardPosition) => {
      setCells((currentCells) => {
        const cell = currentCells[to.row][to.col];
        if (!cell.isPlayable || cell.value !== null) return currentCells;

        const pieceColor = currentCells[from.row][from.col].value
          ? service.getPieceColor(currentCells[from.row][from.col].value)
          : null;
        const moves = service.getValidMoves(currentCells, from, pieceColor);
        const isValid = moves.some((m) => m.row === to.row && m.col === to.col);
        if (!isValid) return currentCells;

        return service.movePiece(currentCells, from, to);
      });
      setSelectedCell(null);
      setValidMoves([]);
    },
    [service],
  );

  const handleDragStart = useCallback((position: BoardPosition) => {
    setDraggedPiece({ from: position });
    const pieceColor = cells[position.row][position.col].value
      ? service.getPieceColor(cells[position.row][position.col].value)
      : null;
    const moves = service.getValidMoves(cells, position, pieceColor);
    setValidMoves(moves);
  }, [cells, service]);

  const handleDrop = useCallback((position: BoardPosition) => {
    if (draggedPiece) {
      handleMove(draggedPiece.from, position);
      setDraggedPiece(null);
      setValidMoves([]);
    }
  }, [draggedPiece, handleMove]);

  const cellsData = useMemo(() => {
    const result: RenderCell[] = [];

    const getCellTouchEnd = (row: number, col: number) => (e: React.TouchEvent) => {
      e.preventDefault();
      if (touchTarget) {
        const target = document.elementFromPoint(touchTarget.col * 100, touchTarget.row * 100);
        if (target) {
          const cellEl = target.closest('[data-row]');
          if (cellEl) {
            const toRow = parseInt(cellEl.getAttribute('data-row') || '0', 10);
            const toCol = parseInt(cellEl.getAttribute('data-col') || '0', 10);
            if (draggedPiece) {
              handleMove(draggedPiece.from, { row: toRow, col: toCol });
              setDraggedPiece(null);
              setValidMoves([]);
            }
          }
        }
      }
      setTouchTarget(null);
    };

    const getCellTouchMove = (row: number, col: number) => (e: React.TouchEvent) => {
      e.preventDefault();
      setTouchTarget({ row, col });
    };

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = cells[row][col];
        const isSelected = selectedCell?.row === row && selectedCell?.col === col;
        const isValidMoveTarget = validMoves.some((m) => m.row === row && m.col === col);
        const isDark = (row + col) % 2 !== 0;
        const bgColor = isDark ? DARK_CELL : LIGHT_CELL;
        const bg = isSelected ? SELECTED_CELL : isValidMoveTarget ? VALID_MOVE_CELL : bgColor;

        let piece: RenderPiece | null = null;
        if (cell.value) {
          const isWhite = cell.value === 'white' || cell.value === 'white-king';
          const isKing = cell.value === 'white-king' || cell.value === 'black-king';
          piece = {
            type: 'piece',
            value: cell.value,
            isWhite,
            isKing,
            isSelected,
            onClick: () => handleCellClick(cell.position),
            onDragStart: () => handleDragStart(cell.position),
            onDragEnd: () => { setDraggedPiece(null); setValidMoves([]); },
          };
        }

        result.push({
          type: 'cell',
          key: `cell-${row}-${col}`,
          bg,
          isPlayable: cell.isPlayable,
          piece,
          showValidDot: isValidMoveTarget && !cell.value,
          onClick: () => handleCellClick(cell.position),
          onDrop: () => handleDrop(cell.position),
          onDragOver: (e: React.DragEvent) => e.preventDefault(),
          onTouchEnd: getCellTouchEnd(row, col),
          onTouchMove: getCellTouchMove(row, col),
        });
      }
    }
    return result;
  }, [cells, selectedCell, validMoves, handleCellClick, handleDrop, draggedPiece, touchTarget, handleDragStart, handleMove]);

  const state: BoardState = { cells, selectedCell, validMoves };
  const actions: BoardActions = { handleCellClick: handleCellClick, handlePieceDrag: handleMove };

  return { state, actions, cellsData, pieceCount, letters: LETTERS, numbers: NUMBERS, draggedPiece, validMoves };
}

export { BOARD_SIZE, PADDING, CELL_SIZE, LETTERS, NUMBERS };
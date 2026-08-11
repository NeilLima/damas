'use client';

import { useCallback } from 'react';
import type { BoardCell, CellValue, BoardPosition } from '../types/BoardTypes';

function createInitialBoard(): BoardCell[][] {
  const rows = 8;
  const cols = 8;
  const board: BoardCell[][] = [];

  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let col = 0; col < cols; col++) {
      const isPlayable = (row + col) % 2 !== 0;
      let value: CellValue = null;

      if (isPlayable) {
        if (row < 3) value = 'black';
        else if (row > 4) value = 'white';
      }

      board[row][col] = {
        position: { row, col },
        value,
        isPlayable,
      };
    }
  }

  return board;
}

function getPieceColor(value: CellValue): 'white' | 'black' | null {
  if (value === 'white' || value === 'white-king') return 'white';
  if (value === 'black' || value === 'black-king') return 'black';
  return null;
}

function isKing(value: CellValue): boolean {
  return value === 'white-king' || value === 'black-king';
}

function cloneBoard(cells: BoardCell[][]): BoardCell[][] {
  return cells.map((row) => row.map((cell) => ({ ...cell })));
}

export function useBoardService() {
  const initBoard = useCallback(() => {
    return createInitialBoard();
  }, []);

  const getValidMoves = useCallback(
    (cells: BoardCell[][], position: BoardPosition, pieceColor: 'white' | 'black' | null): BoardPosition[] => {
      if (!pieceColor) return [];
      const moves: BoardPosition[] = [];
      const { row, col } = position;
      const piece = cells[row][col].value;
      const isKingPiece = isKing(piece);
      
      // Direções: peças normais só vão para frente, rei vai para ambos
      const directions = pieceColor === 'white'
        ? (isKingPiece ? [-1, 1] : [-1])
        : (isKingPiece ? [-1, 1] : [1]);

      for (const dRow of directions) {
        for (const dCol of [-1, 1]) {
          const newRow = row + dRow;
          const newCol = col + dCol;

          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetCell = cells[newRow][newCol];

            // Movimento simples para casa vazia
            if (targetCell.value === null && targetCell.isPlayable) {
              moves.push({ row: newRow, col: newCol });
            }

            // Captura - pular sobre peça adversária
            if (targetCell.value !== null) {
              const targetColor = getPieceColor(targetCell.value);
              if (targetColor !== pieceColor) {
                const jumpRow = row + dRow * 2;
                const jumpCol = col + dCol * 2;

                if (
                  jumpRow >= 0 && jumpRow < 8 &&
                  jumpCol >= 0 && jumpCol < 8
                ) {
                  const jumpCell = cells[jumpRow][jumpCol];
                  if (jumpCell.isPlayable && jumpCell.value === null) {
                    moves.push({ row: jumpRow, col: jumpCol });
                  }
                }
              }
            }
          }
        }
      }

      return moves;
    },
    [],
  );

  const movePiece = useCallback((
    cells: BoardCell[][],
    from: BoardPosition,
    to: BoardPosition,
  ): BoardCell[][] => {
    const newCells = cloneBoard(cells);
    const piece = newCells[from.row][from.col].value;
    
    // Remove peça capturada (se for captura)
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    
    // Se moveu 2 casas em qualquer direção, é captura
    if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
      const capturedRow = from.row + rowDiff / 2;
      const capturedCol = from.col + colDiff / 2;
      newCells[capturedRow][capturedCol] = {
        ...newCells[capturedRow][capturedCol],
        value: null,
      };
    }

    // Promoveção para dama
    let newValue: CellValue = piece;
    if (piece === 'white' && to.row === 0) newValue = 'white-king';
    if (piece === 'black' && to.row === 7) newValue = 'black-king';

    newCells[to.row][to.col] = {
      ...newCells[to.row][to.col],
      value: newValue,
    };
    newCells[from.row][from.col] = {
      ...newCells[from.row][from.col],
      value: null,
    };

    return newCells;
  }, []);

  const hasCaptures = useCallback((
    cells: BoardCell[][],
    from: BoardPosition,
    to: BoardPosition,
  ): boolean => {
    const rowDiff = Math.abs(to.row - from.row);
    return rowDiff === 2;
  }, []);

  return {
    initBoard,
    getValidMoves,
    movePiece,
    hasCaptures,
    getPieceColor,
    isKing,
  };
}
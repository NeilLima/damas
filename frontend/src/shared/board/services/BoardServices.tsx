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

      // Direção de avanço das peças normais: branco sobe (row -1), preto desce (row +1)
      const forwardDirs = pieceColor === 'white' ? [-1] : [1];
      const allRowDirs = [-1, 1];

      // Toda captura (frente ou trás) é permitida para peças normais e damas.
      // A dama também desliza e captura em todas as diagonais.
      if (isKingPiece) {
        // DAMA: desliza em todas as diagonais, capturando peça no caminho
        for (const dRow of allRowDirs) {
          for (const dCol of [-1, 1]) {
            let r = row + dRow;
            let c = col + dCol;
            let crossedEnemy = false;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
              const targetCell = cells[r][c];
              if (!targetCell.isPlayable) break;
              const targetColor = getPieceColor(targetCell.value);

              if (targetColor === null) {
                moves.push({ row: r, col: c });
                if (crossedEnemy) break; // dama aterrissa logo após a peça capturada
              } else if (targetColor === pieceColor) {
                break; // peça própria bloqueia
              } else {
                if (crossedEnemy) break; // não pula duas peças seguidas
                crossedEnemy = true;
              }

              r += dRow;
              c += dCol;
            }
          }
        }
      } else {
        // PEÇA NORMAL
        // (a) Capturas: permitidas em TODAS as diagonais (frente e trás)
        for (const dRow of allRowDirs) {
          for (const dCol of [-1, 1]) {
            const mr = row + dRow;
            const mc = col + dCol;
            if (mr < 0 || mr >= 8 || mc < 0 || mc >= 8) continue;

            const mid = cells[mr][mc];
            const midColor = getPieceColor(mid.value);
            if (midColor && midColor !== pieceColor) {
              const lr = row + dRow * 2;
              const lc = col + dCol * 2;
              if (lr >= 0 && lr < 8 && lc >= 0 && lc < 8) {
                const land = cells[lr][lc];
                if (land.value === null && land.isPlayable) {
                  moves.push({ row: lr, col: lc });
                }
              }
            }
          }
        }

        // (b) Movimento simples: somente 1 casa PARA FRENTE
        for (const dCol of [-1, 1]) {
          const fr = row + forwardDirs[0];
          const fc = col + dCol;
          if (fr >= 0 && fr < 8 && fc >= 0 && fc < 8) {
            const target = cells[fr][fc];
            if (target.value === null && target.isPlayable) {
              moves.push({ row: fr, col: fc });
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

    // Remove peça(s) capturada(s) no caminho (dama desliza várias casas)
    const rowDir = Math.sign(to.row - from.row);
    const colDir = Math.sign(to.col - from.col);
    let r = from.row + rowDir;
    let c = from.col + colDir;
    while (r !== to.row || c !== to.col) {
      const mid = newCells[r][c];
      if (mid.value !== null) {
        newCells[r][c] = { ...mid, value: null };
      }
      r += rowDir;
      c += colDir;
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
    const fromColor = getPieceColor(cells[from.row][from.col].value);
    if (!fromColor) return false;
    const rowDir = Math.sign(to.row - from.row);
    const colDir = Math.sign(to.col - from.col);
    let r = from.row + rowDir;
    let c = from.col + colDir;
    while (r !== to.row || c !== to.col) {
      const midColor = getPieceColor(cells[r][c].value);
      if (midColor !== null && midColor !== fromColor) return true;
      r += rowDir;
      c += colDir;
    }
    return false;
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
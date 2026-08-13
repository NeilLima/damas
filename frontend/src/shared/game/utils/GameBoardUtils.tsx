// ============================================
// Renderização do Tabuleiro + Apresentação
// Feature IA Computador (Damas Automáticas)
// ============================================
'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import type { BoardPosition } from '../../board/types/BoardTypes';
import { useBoardService } from '../../board/services/BoardServices';
import { useGameControl } from './GameControlUtils';
import type {
  GameBoardReturn,
  GamePresentation,
  RenderCell,
  RenderPiece,
} from '../types/GameTypes';

// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const DARK_CELL = '#1a1a1a';
const LIGHT_CELL = '#f5f5f5';
const SELECTED_CELL = '#3a6ea5';
const VALID_MOVE_CELL = '#4a9c6b';
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const NUMBERS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Médio' },
  { value: 'hard', label: 'Difícil' },
] as const;

const COLOR_OPTIONS = [
  { value: 'white', label: 'Brancas' },
  { value: 'black', label: 'Pretas' },
] as const;

// ============================================
// 2️⃣ ESTADOS
// ============================================
export function useGameBoardState(): GameBoardReturn {
  const service = useBoardService();
  const { state, actions } = useGameControl();

  const { cells, currentTurn, humanColor } = state;

  const [selectedCell, setSelectedCell] = useState<BoardPosition | null>(null);
  const [validMoves, setValidMoves] = useState<BoardPosition[]>([]);
  // Ref do arrasto: evita re-render durante pointermove (causa "trava").
  const dragRef = useRef<{ from: BoardPosition; pointerId: number } | null>(null);

  // ============================================
  // 3️⃣ OBJETOS
  // ============================================

  // ============================================
  // 4️⃣ FUNÇÕES
  // ============================================

  /** Seleciona uma peça (somente se for vez/humana) e calcula movimentos válidos. */
  const handleCellClick = useCallback(
    (position: BoardPosition) => {
      if (state.result !== 'playing' || state.isAiThinking) return;

      const cell = cells[position.row][position.col];
      const pieceColor = cell.value ? service.getPieceColor(cell.value) : null;

      if (selectedCell) {
        const isDestValid = validMoves.some(
          (m) => m.row === position.row && m.col === position.col,
        );
        if (isDestValid) {
          actions.handlePieceDrag(selectedCell, position);
          setSelectedCell(null);
          setValidMoves([]);
          return;
        }
        setSelectedCell(null);
        setValidMoves([]);
        return;
      }

      if (cell.value && pieceColor === humanColor && currentTurn === humanColor) {
        setSelectedCell(position);
        const moves = service.getValidMoves(cells, position, pieceColor);
        setValidMoves(moves);
      }
    },
    [cells, selectedCell, validMoves, state.result, state.isAiThinking, currentTurn, humanColor, service, actions],
  );

  const handleDragStart = useCallback(
    (position: BoardPosition) => {
      if (state.result !== 'playing' || state.isAiThinking) return;
      const cell = cells[position.row][position.col];
      const pieceColor = cell.value ? service.getPieceColor(cell.value) : null;
      const isHumanPiece =
        cell.value && pieceColor === humanColor && currentTurn === humanColor;
      // Marca a peça como selecionada e mostra os movimentos válidos.
      if (isHumanPiece) {
        setSelectedCell(position);
        const moves = service.getValidMoves(cells, position, pieceColor as never);
        setValidMoves(moves);
      }
    },
    [cells, currentTurn, humanColor, state.result, state.isAiThinking, service],
  );

  /** Aplica um movimento por arrasto (pointer/touch), se válido. */
  const handleMove = useCallback(
    (from: BoardPosition, to: BoardPosition) => {
      if (state.result !== 'playing' || state.isAiThinking) return;
      if (state.humanColor === state.currentTurn) {
        actions.handlePieceDrag(from, to);
      }
            setSelectedCell(null);
      setValidMoves([]);
      dragRef.current = null;
    },
    [state.result, state.isAiThinking, state.humanColor, state.currentTurn, actions],
  );

  const pieceCount = useMemo(
    () => cells.flat().filter((cell) => cell.value !== null).length,
    [cells],
  );

  const cellsData = useMemo(() => {
    const result: RenderCell[] = [];

    /** Retorna a posição (row,col) da célula que está sob as coordenadas.
     *  Usa elementsFromPoint (pilha completa de elementos) e PULA os decorativos
     *  com `pointer-events: none` (halo/fogos/coroa da dama). O elementFromPoint
     *  retornaria esses elementos mesmo sem receberem eventos, fazendo o destino
     *  resolver para a célula de origem e a dama "não deslizar" no toque. */
    const getCellAtPoint = (x: number, y: number): BoardPosition | null => {
      const stack: Element[] = document.elementsFromPoint(x, y);
      if (stack.length === 0) return null;
      for (const el of stack) {
        if (el instanceof HTMLElement) {
          const cs = window.getComputedStyle(el);
          if (cs.pointerEvents === 'none') continue;
        }
        const cellEl = el.closest('[data-row]');
        if (cellEl) {
          const toRow = parseInt(cellEl.getAttribute('data-row') || '0', 10);
          const toCol = parseInt(cellEl.getAttribute('data-col') || '0', 10);
          return { row: toRow, col: toCol };
        }
      }
      return null;
    };

        const clearDrag = () => {
      dragRef.current = null;
    };

    /** Início do arrasto (pointerdown). Funciona para mouse e touch. */
    const handlePointerDown = (position: BoardPosition) => (e: React.PointerEvent) => {
      e.preventDefault();
      const cell = cells[position.row][position.col];
      const pieceColor = cell.value ? service.getPieceColor(cell.value) : null;
      const isHumanPiece =
        cell.value && pieceColor === humanColor && currentTurn === humanColor;
      if (!isHumanPiece) return;
            handleDragStart(position);
      // Marca o arrasto numa ref (sem re-render) — evita "travar" o gesto no touch.
      dragRef.current = { from: position, pointerId: e.pointerId };
      // Garante que nenhum gesto nativo role a tela enquanto arrasta.
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };

        // O movimento durante o arrasto NÃO faz setState (evita re-render que trava no touch).
    const handlePointerMove = () => (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
    };

    /** Fim do arrasto: aplica o movimento se soltar numa célula válida (não a origem). */
    const handlePointerUp = () => (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      e.preventDefault();
      const pos = getCellAtPoint(e.clientX, e.clientY);
      const from = dragRef.current.from;
      if (pos && (pos.row !== from.row || pos.col !== from.col)) {
        handleMove(from, pos);
      }
      clearDrag();
    };

    const handleCellPointerUp = (row: number, col: number) => (e: React.PointerEvent) => {
      // Movimento por toque: se já há peça selecionada e soltar em célula válida, move.
      if (selectedCell) {
        e.preventDefault();
        handleMove(selectedCell, { row, col });
      }
    };

    const handleCellPointerMove = (row: number, col: number) => (e: React.PointerEvent) => {
      if (dragRef.current) e.preventDefault();
    };

    const handleCellTouchMove = (row: number, col: number) => (e: React.TouchEvent) => {
      e.preventDefault();
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
          const position = cell.position;
          piece = {
            type: 'piece',
            value: cell.value,
            isWhite,
            isKing,
            isSelected,
            onClick: () => handleCellClick(position),
            onPointerDown: handlePointerDown(position),
            onPointerMove: handlePointerMove(),
            onPointerUp: handlePointerUp(),
            onPointerCancel: () => clearDrag(),
            onTouchStart: (e) => e.preventDefault(),
            onTouchMove: (e) => e.preventDefault(),
            onTouchEnd: (e) => e.preventDefault(),
            onDragStart: (e) => {
              if ('dataTransfer' in e && e.dataTransfer) {
                e.dataTransfer.setData('text/plain', `${position.row},${position.col}`);
              }
              handleDragStart(position);
            },
            onDragEnd: () => { setSelectedCell(null); setValidMoves([]); clearDrag(); },
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
          onPointerMove: handleCellPointerMove(row, col),
          onPointerUp: handleCellPointerUp(row, col),
          onDrop: (e) => {
            e.preventDefault();
            const src = (e.dataTransfer?.getData('text/plain') || '').split(',').map(Number);
            if (src.length === 2) handleMove({ row: src[0], col: src[1] }, cell.position);
          },
          onDragOver: (e: React.DragEvent) => e.preventDefault(),
          onTouchEnd: () => {},
          onTouchMove: handleCellTouchMove(row, col),
        });
      }
    }
    return result;
  }, [cells, selectedCell, validMoves, handleCellClick, handleDragStart, handleMove, state.result, state.isAiThinking, humanColor, currentTurn, service]);

  return {
    cellsData,
    pieceCount,
    letters: LETTERS,
    numbers: NUMBERS,
    selectedCell,
    validMoves,
  };
}

// ============================================
// Apresentação (labels/opções derivados do estado)
// ============================================
export function useGamePresentation(): GamePresentation {
  const { state } = useGameControl();

  const isHumanTurn = state.currentTurn === state.humanColor && state.result === 'playing';

  const resultLabel =
    state.result === 'human_won'
      ? '🎉 Você venceu!'
      : state.result === 'ai_won'
        ? '🤖 O computador venceu!'
        : state.result === 'draw'
          ? '🤝 Empate'
          : null;

  return {
    difficultyOptions: DIFFICULTY_OPTIONS,
    colorOptions: COLOR_OPTIONS,
    isHumanTurn,
    resultLabel,
  };
}

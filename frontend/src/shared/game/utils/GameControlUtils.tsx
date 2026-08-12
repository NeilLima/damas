// ============================================
// Controle do Jogo - Turnos + IA (Computador)
// Feature IA Computador (Damas Automáticas)
// ============================================
'use client';

import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { BoardCell, BoardPosition } from '../../board/types/BoardTypes';
import { useBoardService } from '../../board/services/BoardServices';
import { chooseAIMove } from '../services/GameAIServices';
import type {
  GameControlReturn,
  AIDifficulty,
  PlayerColor,
} from '../types/GameTypes';

// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const THINK_DELAY_MS = 350;

function opposite(color: PlayerColor): PlayerColor {
  return color === 'white' ? 'black' : 'white';
}

// ============================================
// Contexto único do jogo (compartilhado por toda a árvore)
// ============================================
interface GameControlContextValue extends GameControlReturn {}

const GameControlContext = createContext<GameControlContextValue | undefined>(undefined);

/** Lê o estado e ações únicos do jogo (deve estar dentro de <GameControlProvider>). */
export function useGameControl(): GameControlReturn {
  const ctx = useContext(GameControlContext);
  if (!ctx) {
    throw new Error('useGameControl deve ser usado dentro de <GameControlProvider>.');
  }
  return ctx;
}

// ============================================
// 2️⃣ PROVIDER
// ============================================
export function GameControlProvider({ children }: { children: ReactNode }) {
  const service = useBoardService();

  const [cells, setCells] = useState<BoardCell[][]>(() => service.initBoard());
  const [currentTurn, setCurrentTurn] = useState<PlayerColor>('white');
  const [humanColor, setHumanColorState] = useState<PlayerColor>('white');
  const [difficulty, setDifficultyState] = useState<AIDifficulty>('medium');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [result, setResult] = useState<GameControlReturn['state']['result']>('playing');

  const aiColor: PlayerColor = humanColor === 'white' ? 'black' : 'white';

  // Referência ao board mais recente para uso dentro do fluxo da IA
  const cellsRef = useRef<BoardCell[][]>(cells);
  useEffect(() => {
    cellsRef.current = cells;
  }, [cells]);

  // ============================================
  // 4️⃣ FUNÇÕES
  // ============================================

  /** Aplica um movimento válido e retorna o novo tabuleiro (ou null se inválido). */
  const applyMoveIfValid = useCallback(
    (board: BoardCell[][], from: BoardPosition, to: BoardPosition): BoardCell[][] | null => {
      const piece = board[from.row][from.col].value;
      const pieceColor = service.getPieceColor(piece);
      if (!pieceColor) return null;

      const moves = service.getValidMoves(board, from, pieceColor);
      const isValid = moves.some((m) => m.row === to.row && m.col === to.col);
      if (!isValid) return null;

      return service.movePiece(board, from, to);
    },
    [service],
  );

  /** Checa se a cor dada perdeu (sem peças ou sem movimentos). */
  const hasLost = useCallback(
    (board: BoardCell[][], color: PlayerColor): boolean => {
      let foundPiece = false;
      let foundMove = false;
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          const pieceColor = service.getPieceColor(board[row][col].value);
          if (pieceColor === color) {
            foundPiece = true;
            const moves = service.getValidMoves(board, { row, col }, color);
            if (moves.length > 0) {
              foundMove = true;
              break;
            }
          }
        }
        if (foundMove) break;
      }
      return !foundPiece || !foundMove;
    },
    [service],
  );

  /** Depois de um movimento, atualiza turno e verifica fim de jogo. */
  const afterMove = useCallback(
    (nextBoard: BoardCell[][], moverColor: PlayerColor) => {
      const nextTurn = opposite(moverColor);
      setCells(nextBoard);
      setCurrentTurn(nextTurn);

      if (hasLost(nextBoard, nextTurn)) {
        setResult(moverColor === humanColor ? 'human_won' : 'ai_won');
      }
    },
    [hasLost, humanColor],
  );

  /** Dispara a jogada da IA (no turno da IA). */
  const runAITurn = useCallback(() => {
    setIsAiThinking(true);
    const board = cellsRef.current;
    const move = chooseAIMove(board, aiColor, difficulty);
    if (move) {
      const nextBoard = applyMoveIfValid(board, move.from, move.to);
      if (nextBoard) {
        afterMove(nextBoard, aiColor);
      }
    }
    setIsAiThinking(false);
  }, [aiColor, difficulty, applyMoveIfValid, afterMove]);

  /** Ação do jogador humano: só deve jogar na sua vez e se o jogo está ativo. */
  const handleHumanMove = useCallback(
    (from: BoardPosition, to: BoardPosition) => {
      if (result !== 'playing') return;
      if (currentTurn !== humanColor) return;
      if (isAiThinking) return;

      const board = cellsRef.current;
      const piece = board[from.row][from.col].value;
      const pieceColor = service.getPieceColor(piece);
      if (!pieceColor || pieceColor !== humanColor) return;

      const nextBoard = applyMoveIfValid(board, from, to);
      if (!nextBoard) return;

      afterMove(nextBoard, humanColor);
    },
    [result, currentTurn, humanColor, isAiThinking, service, applyMoveIfValid, afterMove],
  );

  /** Reinicia o jogo com as configurações atuais de cor e dificuldade. */
  const startNewGame = useCallback(() => {
    const fresh = service.initBoard();
    setCells(fresh);
    cellsRef.current = fresh;
    setCurrentTurn('white'); // brancas sempre começam
    setResult('playing');
    setIsAiThinking(false);
  }, [service]);

  /** Muda a cor do humano e reinicia. */
  const setHumanColor = useCallback(
    (color: PlayerColor) => {
      setHumanColorState(color);
      const fresh = service.initBoard();
      setCells(fresh);
      cellsRef.current = fresh;
      setCurrentTurn('white'); // brancas sempre começam
      setResult('playing');
      setIsAiThinking(false);
    },
    [service],
  );

  /** Muda a dificuldade sem reiniciar a partida em curso. */
  const setDifficulty = useCallback((diff: AIDifficulty) => {
    setDifficultyState(diff);
  }, []);

  // Se a IA for quem começa (humano jogou de preto), dispara automaticamente.
  useEffect(() => {
    if (result === 'playing' && currentTurn === aiColor && !isAiThinking) {
      const t = setTimeout(runAITurn, THINK_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [currentTurn, aiColor, result, isAiThinking, runAITurn]);

  const state: GameControlReturn['state'] = {
    cells,
    currentTurn,
    humanColor,
    aiColor,
    difficulty,
    isAiThinking,
    result,
  };

  const actions: GameControlReturn['actions'] = {
    handleCellClick: handleHumanMove,
    handlePieceDrag: handleHumanMove,
    setDifficulty,
    setHumanColor,
    startNewGame,
  };

  return (
    <GameControlContext.Provider value={{ state, actions }}>
      {children}
    </GameControlContext.Provider>
  );
}

'use client';

// ============================================
// MultiplayerUtils - Estado e ações do jogo online
// Multiplayer Online (Damas)
// ============================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBoardService } from '../../board/services/BoardServices';
import type { BoardPosition, CellValue, BoardCell } from '../../board/types/BoardTypes';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MULTIPLAYER_SOCKET } from '../services/MultiplayerServices';
import type {
  MultiplayerState,
  MultiplayerStatePayload,
} from '../types/MultiplayerTypes';

const INITIAL_STATE: MultiplayerState = {
  phase: 'menu',
  roomId: null,
  myColor: null,
  myId: null,
  board: null,
  turn: null,
  winner: null,
  connected: false,
  error: null,
};

export function useMultiplayer() {
  const service = useBoardService();
  const { userId } = useAuth();
  const { connected, emit, on, off } = useWebSocket();

  const [state, setState] = useState<MultiplayerState>(INITIAL_STATE);

  // Refs para evitar closures desatualizadas nos handlers do socket
  const stateRef = useRef(state);
  stateRef.current = state;

  const setBoardPayload = useCallback((payload: MultiplayerStatePayload) => {
    setState((prev) => ({ ...prev, board: payload.board, turn: payload.turn }));
  }, []);

  // ============================================
  // 4️⃣ FUNÇÕES / AÇÕES
  // ============================================

  const createRoom = useCallback(() => {
    const myId = userId || `player-${Date.now()}`;
    emit(MULTIPLAYER_SOCKET.createRoom, { playerId: myId, playerName: `Jogador ${myId.slice(0, 4)}` });
    setState((prev) => ({ ...prev, myId, phase: 'waiting', error: null, winner: null }));
  }, [emit, userId]);

  const joinRoom = useCallback(
    (roomId: string) => {
      const myId = userId || `player-${Date.now()}`;
      emit(MULTIPLAYER_SOCKET.joinRoom, {
        roomId,
        playerId: myId,
        playerName: `Jogador ${myId.slice(0, 4)}`,
      });
      setState((prev) => ({ ...prev, myId, phase: 'waiting', error: null, winner: null }));
    },
    [emit, userId],
  );

  const makeMove = useCallback(
    (from: BoardPosition, to: BoardPosition) => {
      const s = stateRef.current;
      if (!s.roomId || s.phase !== 'playing') return;
      if (!s.myColor || s.turn !== s.myColor) return;
      emit(MULTIPLAYER_SOCKET.makeMove, {
        roomId: s.roomId,
        fromRow: from.row,
        fromCol: from.col,
        toRow: to.row,
        toCol: to.col,
      });
    },
    [emit],
  );

  const reset = useCallback(() => {
    const roomId = stateRef.current.roomId;
    if (!roomId) return;
    emit(MULTIPLAYER_SOCKET.reset, { roomId });
    setState((prev) => ({ ...prev, phase: 'waiting', winner: null }));
  }, [emit]);

  const leaveRoom = useCallback(() => {
    const roomId = stateRef.current.roomId;
    if (roomId) emit(MULTIPLAYER_SOCKET.leave, roomId);
    setState(INITIAL_STATE);
  }, [emit]);

  // ============================================
  // 3️⃣ OBJETOS / HANDLERS DO SOCKET
  // ============================================

  useEffect(() => {
    on(MULTIPLAYER_SOCKET.roomCreated, (raw) => {
      const data = raw as { roomId: string; color: 'white' | 'black'; state: MultiplayerStatePayload };
      setState((prev) => ({
        ...prev,
        roomId: data.roomId,
        myColor: data.color,
        phase: 'waiting',
        error: null,
        board: data.state?.board ?? prev.board,
        turn: data.state?.turn ?? prev.turn,
      }));
    });

    on(MULTIPLAYER_SOCKET.roomJoined, (raw) => {
      const data = raw as { roomId: string; color: 'white' | 'black'; state: MultiplayerStatePayload };
      setState((prev) => ({
        ...prev,
        roomId: data.roomId,
        myColor: data.color,
        phase: 'waiting',
        error: null,
        board: data.state?.board ?? prev.board,
        turn: data.state?.turn ?? prev.turn,
      }));
    });

    on(MULTIPLAYER_SOCKET.gameStart, (raw) => {
      const data = raw as { roomId: string; state: MultiplayerStatePayload; players: { id: string; color: 'white' | 'black' }[] };
      const me = data.players.find((p) => p.id === stateRef.current.myId);
      setState((prev) => ({
        ...prev,
        roomId: data.roomId,
        phase: 'playing',
        myColor: me ? me.color : prev.myColor,
        board: data.state.board,
        turn: data.state.turn,
        winner: null,
        error: null,
      }));
    });

    on(MULTIPLAYER_SOCKET.moveMade, (raw) => {
      const data = raw as { state: MultiplayerStatePayload };
      setBoardPayload(data.state);
    });

    on(MULTIPLAYER_SOCKET.gameOver, (raw) => {
      const data = raw as { winner: 'white' | 'black' | null; state: MultiplayerStatePayload };
      setState((prev) => ({
        ...prev,
        phase: 'over',
        winner: data.winner,
        board: data.state.board,
        turn: data.state.turn,
      }));
    });

    on(MULTIPLAYER_SOCKET.playerDisconnected, (raw) => {
      const data = raw as { roomId: string };
      setState((prev) => (prev.roomId === data.roomId ? { ...prev, phase: 'menu', error: 'Oponente desconectou-se.' } : prev));
    });

    on(MULTIPLAYER_SOCKET.roomClosed, (raw) => {
      const data = raw as { roomId: string };
      setState((prev) => (prev.roomId === data.roomId ? INITIAL_STATE : prev));
    });

    on(MULTIPLAYER_SOCKET.roomError, (raw) => {
      const data = raw as { message: string };
      setState((prev) => ({ ...prev, phase: 'menu', error: data.message }));
    });

    on(MULTIPLAYER_SOCKET.moveRejected, () => {
      setState((prev) => ({ ...prev, error: 'Movimento inválido.' }));
    });

    return () => {
      off(MULTIPLAYER_SOCKET.roomCreated);
      off(MULTIPLAYER_SOCKET.roomJoined);
      off(MULTIPLAYER_SOCKET.gameStart);
      off(MULTIPLAYER_SOCKET.moveMade);
      off(MULTIPLAYER_SOCKET.gameOver);
      off(MULTIPLAYER_SOCKET.playerDisconnected);
      off(MULTIPLAYER_SOCKET.roomClosed);
      off(MULTIPLAYER_SOCKET.roomError);
      off(MULTIPLAYER_SOCKET.moveRejected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setState((prev) => ({ ...prev, connected }));
  }, [connected]);

  // ============================================
  // 2️⃣ INFORMAÇÃO DE RENDER
  // ============================================
  const renderInfo = useMemo(
    () => ({
      cellBg: (row: number, col: number) => {
        const isDark = (row + col) % 2 !== 0;
        return isDark ? '#8B6914' : '#D2B48C';
      },
      pieceColor: (value: CellValue): 'white' | 'black' | null => {
        if (value === 'white' || value === 'white-king') return 'white';
        if (value === 'black' || value === 'black-king') return 'black';
        return null;
      },
      isKing: (value: CellValue): boolean => value === 'white-king' || value === 'black-king',
    }),
    [],
  );

  const actions = useMemo(
    () => ({ createRoom, joinRoom, makeMove, reset, leaveRoom }),
    [createRoom, joinRoom, makeMove, reset, leaveRoom],
  );


  // ============================================
  // INTERAÇÃO DO TABULEIRO (seleção + movimento)
  // ============================================
  const [selectedCell, setSelectedCell] = useState<BoardPosition | null>(null);
  const [validMoves, setValidMoves] = useState<BoardPosition[]>([]);
  const selectedRef = useRef<BoardPosition | null>(null);
  const validMovesRef = useRef<BoardPosition[]>([]);

  const setSelection = useCallback((sel: BoardPosition | null, moves: BoardPosition[]) => {
    selectedRef.current = sel;
    validMovesRef.current = moves;
    setSelectedCell(sel);
    setValidMoves(moves);
  }, []);

  const handleCellClick = useCallback(
    (position: BoardPosition) => {
      const s = stateRef.current;
      if (!s.board || s.phase !== 'playing' || !s.myColor || s.turn !== s.myColor) {
        setSelection(null, []);
        return;
      }
      const cell = s.board[position.row]?.[position.col];
      const pieceColor = cell?.value ? renderInfo.pieceColor(cell.value) : null;

      if (selectedRef.current) {
        const isDest = validMovesRef.current.some((m) => m.row === position.row && m.col === position.col);
        if (isDest) {
          makeMove(selectedRef.current, position);
          setSelection(null, []);
          return;
        }
        setSelection(null, []);
        return;
      }

      if (pieceColor === s.myColor) {
        const moves = service.getValidMoves(s.board, position, pieceColor);
        setSelection(position, moves);
      }
    },
    [makeMove, renderInfo, service, setSelection],
  );

  const cellsData = useMemo(() => {
    const result: {
      key: string;
      bg: string;
      isPlayable: boolean;
      piece: {
        value: CellValue;
        isWhite: boolean;
        isKing: boolean;
        isSelected: boolean;
        onClick: () => void;
      } | null;
      showValidDot: boolean;
      onClick: () => void;
    }[] = [];

    const board = state.board || service.initBoard();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const cell = board[row][col] as BoardCell | undefined;
        const isSelected = selectedCell?.row === row && selectedCell?.col === col;
        const isValidMoveTarget = validMoves.some((m) => m.row === row && m.col === col);
        const bg = isSelected ? '#3a6ea5' : isValidMoveTarget ? '#4a9c6b' : renderInfo.cellBg(row, col);

        let piece = null;
        if (cell && cell.value) {
          piece = {
            value: cell.value,
            isWhite: cell.value === 'white' || cell.value === 'white-king',
            isKing: renderInfo.isKing(cell.value),
            isSelected,
            onClick: () => handleCellClick({ row, col }),
          };
        }

        result.push({
          key: `cell-${row}-${col}`,
          bg,
          isPlayable: cell ? cell.isPlayable : false,
          piece,
          showValidDot: isValidMoveTarget && !cell?.value,
          onClick: () => handleCellClick({ row, col }),
        });
      }
    }
    return result;
  }, [state.board, selectedCell, validMoves, service, handleCellClick, renderInfo]);

  const letters = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], []);
  const numbers = useMemo(() => ['8', '7', '6', '5', '4', '3', '2', '1'], []);

  return {
    state,
    actions,
    renderInfo,
    service,
    cellsData,
    selectedCell,
    validMoves,
    letters,
    numbers,
    handleCellClick,
  };
}

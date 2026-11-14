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

// ============================================
// Modo de transporte: 'socket' (dev local) ou
// 'rest' (produção/Vercel — WebSocket não é
// suportado em serverless; polling a cada 1.5s)
// 'auto' = tenta socket e cai pra REST se falhar
// ============================================
type MpMode = 'socket' | 'rest';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const POLL_MS = 1500;

interface RestRoomPayload {
  roomId: string;
  color?: 'white' | 'black' | null;
  status?: 'waiting' | 'playing' | 'over';
  winner?: 'white' | 'black' | null;
  turn?: 'white' | 'black';
  lastMove?: unknown;
  players?: { id: string; name: string; color: 'white' | 'black' }[];
  state?: MultiplayerStatePayload;
}

export function useMultiplayer() {
  const service = useBoardService();
  const { userId } = useAuth();
  const { connected, emit, on, off } = useWebSocket();

  const [state, setState] = useState<MultiplayerState>(INITIAL_STATE);
  const [mode, setMode] = useState<MpMode>('socket');
  const modeRef = useRef<MpMode>('socket');
  const socketGraceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  // 🌐 MODO REST (polling) — fallback p/ produção
  // ============================================

  const restHeaders = { 'Content-Type': 'application/json' } as const;

  const restCreateRoom = useCallback(async () => {
    const myId = userId || `player-${Date.now()}`;
    try {
      const res = await fetch(`${API_BASE}/game/rooms`, {
        method: 'POST',
        headers: restHeaders,
        body: JSON.stringify({ playerId: myId, playerName: `Jogador ${myId.slice(0, 4)}` }),
      });
      if (!res.ok) throw new Error('Falha ao criar sala');
      const data = (await res.json()) as RestRoomPayload;
      setState((prev) => ({
        ...prev,
        roomId: data.roomId,
        myColor: data.color ?? 'white',
        myId,
        phase: 'waiting',
        error: null,
        winner: null,
      }));
    } catch {
      setState((prev) => ({ ...prev, phase: 'menu', error: 'Não foi possível conectar ao servidor.' }));
    }
  }, [userId]);

  const restJoinRoom = useCallback(
    async (roomId: string) => {
      const myId = userId || `player-${Date.now()}`;
      try {
        const res = await fetch(`${API_BASE}/game/rooms/join`, {
          method: 'POST',
          headers: restHeaders,
          body: JSON.stringify({ code: roomId, playerId: myId, playerName: `Jogador ${myId.slice(0, 4)}` }),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(err.message || 'Sala não encontrada ou cheia');
        }
        const data = (await res.json()) as RestRoomPayload;
        const isPlaying = data.status === 'playing';
        setState((prev) => ({
          ...prev,
          roomId,
          myColor: data.color ?? null,
          myId,
          phase: isPlaying ? 'playing' : 'waiting',
          board: data.state?.board ?? prev.board,
          turn: data.state?.turn ?? prev.turn,
          error: null,
        }));
      } catch (e) {
        setState((prev) => ({ ...prev, phase: 'menu', error: (e as Error).message }));
      }
    },
    [userId],
  );

  const restMakeMove = useCallback(
    async (from: BoardPosition, to: BoardPosition) => {
      const s = stateRef.current;
      if (!s.roomId || s.phase !== 'playing' || !s.myId) return;
      try {
        const res = await fetch(`${API_BASE}/game/rooms/${s.roomId}/move`, {
          method: 'POST',
          headers: restHeaders,
          body: JSON.stringify({
            playerId: s.myId,
            fromRow: from.row,
            fromCol: from.col,
            toRow: to.row,
            toCol: to.col,
          }),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(err.message || 'Movimento inválido');
        }
        const data = (await res.json()) as RestRoomPayload;
        setState((prev) => ({
          ...prev,
          board: data.state?.board ?? prev.board,
          turn: data.turn ?? prev.turn,
          phase: data.status === 'over' ? 'over' : prev.phase,
          winner: data.winner ?? prev.winner,
          error: null,
        }));
      } catch (e) {
        setState((prev) => ({ ...prev, error: (e as Error).message }));
      }
    },
    [],
  );

  const restReset = useCallback(async () => {
    const roomId = stateRef.current.roomId;
    if (!roomId) return;
    try {
      const res = await fetch(`${API_BASE}/game/rooms/${roomId}/reset`, { method: 'POST' });
      if (res.ok) setState((prev) => ({ ...prev, phase: 'waiting', winner: null }));
    } catch {
      /* silencioso — polling corrige */
    }
  }, []);

  const restLeaveRoom = useCallback(async () => {
    const s = stateRef.current;
    if (s.roomId && s.myId) {
      fetch(`${API_BASE}/game/rooms/${s.roomId}?playerId=${encodeURIComponent(s.myId)}`, { method: 'DELETE' }).catch(() => undefined);
    }
    setState(INITIAL_STATE);
  }, []);

  // Polling do estado da sala quando em modo REST
  useEffect(() => {
    if (mode !== 'rest' || !state.roomId || state.phase === 'menu') return;
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/game/rooms/${state.roomId}?playerId=${encodeURIComponent(state.myId || '')}`);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as RestRoomPayload;
        if (cancelled) return;
        setState((prev) => {
          if (prev.roomId !== data.roomId) return prev;
          const playersCount = data.players?.length ?? 0;
          const phase =
            data.status === 'over'
              ? 'over'
              : data.status === 'playing' || playersCount >= 2
                ? 'playing'
                : 'waiting';
          return {
            ...prev,
            myColor: data.color ?? prev.myColor,
            board: data.state?.board ?? prev.board,
            turn: data.turn ?? prev.turn,
            winner: data.winner ?? prev.winner,
            phase,
            error: null,
          };
        });
      } catch {
        /* silencioso — tenta de novo no próximo tick */
      }
    };
    poll();
    const timer = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, state.roomId, state.myId]);

  // Fallback automático: se o socket não conectar em 6s, ativa REST
  useEffect(() => {
    if (socketGraceRef.current) clearTimeout(socketGraceRef.current);
    socketGraceRef.current = setTimeout(() => {
      setMode((prev) => {
        if (prev === 'socket' && !connected) {
          modeRef.current = 'rest';
          return 'rest';
        }
        return prev;
      });
    }, 6000);
    return () => {
      if (socketGraceRef.current) clearTimeout(socketGraceRef.current);
    };
  }, [connected]);

  // Ações despacham pro transporte ativo
  const dispatch = useCallback(
    (fn: 'create' | 'join' | 'move' | 'reset' | 'leave', ...args: unknown[]) => {
      const m = modeRef.current;
      if (m === 'rest') {
        if (fn === 'create') void restCreateRoom();
        else if (fn === 'join') void restJoinRoom(args[0] as string);
        else if (fn === 'move') void restMakeMove(args[0] as BoardPosition, args[1] as BoardPosition);
        else if (fn === 'reset') void restReset();
        else if (fn === 'leave') void restLeaveRoom();
        return;
      }
      if (fn === 'create') createRoom();
      else if (fn === 'join') joinRoom(args[0] as string);
      else if (fn === 'move') makeMove(args[0] as BoardPosition, args[1] as BoardPosition);
      else if (fn === 'reset') reset();
      else if (fn === 'leave') leaveRoom();
    },
    [createRoom, joinRoom, makeMove, reset, leaveRoom, restCreateRoom, restJoinRoom, restMakeMove, restReset, restLeaveRoom],
  );

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

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
    setState((prev) => ({ ...prev, connected: mode === 'rest' ? true : connected }));
  }, [connected, mode]);

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
    () => ({
      createRoom: () => dispatch('create'),
      joinRoom: (roomId: string) => dispatch('join', roomId),
      makeMove: (from: BoardPosition, to: BoardPosition) => dispatch('move', from, to),
      reset: () => dispatch('reset'),
      leaveRoom: () => dispatch('leave'),
    }),
    [dispatch],
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

'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// ============================================
// useWebSocket - Conexão global com o servidor
// Multiplayer Online (Damas)
// Namespace padrão: /game
// ============================================

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002/game';

type HandlerMap = Record<string, (...args: unknown[]) => void>;

interface UseWebSocketReturn {
  socket: Socket | null;
  connected: boolean;
  emit: (event: string, payload?: unknown) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler?: (...args: unknown[]) => void) => void;
}

let sharedSocket: Socket | null = null;

function getSocket(): Socket {
  if (!sharedSocket) {
    sharedSocket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return sharedSocket;
}

export function useWebSocket(): UseWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const handlersRef = useRef<HandlerMap>({});

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    setConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const emit = (event: string, payload?: unknown): void => {
    socketRef.current?.emit(event, payload);
  };

  const on = (event: string, handler: (...args: unknown[]) => void): void => {
    if (!handlersRef.current[event]) {
      socketRef.current?.on(event, (...args: unknown[]) => {
        handlersRef.current[event]?.(...args);
      });
    }
    handlersRef.current[event] = handler;
  };

  const off = (event: string, handler?: (...args: unknown[]) => void): void => {
    if (handler) {
      const current = handlersRef.current[event];
      if (current === handler) {
        delete handlersRef.current[event];
      }
    } else {
      delete handlersRef.current[event];
    }
  };

  return { socket: socketRef.current, connected, emit, on, off };
}

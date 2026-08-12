'use client';

// ============================================
// HistoryServices - listagem de partidas (TanStack Query)
// ============================================
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/api';
import type { HistoryMatch } from '../types/HistoryTypes';

export function useMatchHistory(playerId: string | null) {
  return useQuery<HistoryMatch[]>({
    queryKey: ['game-history', playerId],
    queryFn: () =>
      api
        .get<HistoryMatch[]>('/game/history', { params: { playerId } })
        .then((res) => res.data),
    enabled: !!playerId,
  });
}
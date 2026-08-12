'use client';

// ============================================
// HistoryUtils - formatação e seleção do estado do histórico
// ============================================
import { useMemo } from 'react';
import { getStoredUserId } from '@/shared/auth/services/AuthServices';
import { useMatchHistory } from '../services/HistoryServices';
import type { HistoryMatch, HistoryMatchView, HistoryState } from '../types/HistoryTypes';

function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toView(match: HistoryMatch): HistoryMatchView {
  const resultMeta: Record<HistoryMatch['result'], { label: string; color: string }> = {
    win: { label: 'Vitória', color: '#4caf50' },
    loss: { label: 'Derrota', color: '#e53935' },
    draw: { label: 'Empate', color: '#ff9800' },
    ongoing: { label: 'Em andamento', color: '#3a6ea5' },
  };
  const meta = resultMeta[match.result];
  return {
    key: match.id,
    opponentLabel: match.type === 'BOT' ? 'Computador' : match.opponentId ? `Jogador ${match.opponentId.slice(0, 6)}` : 'Oponente',
    resultLabel: meta.label,
    resultColor: meta.color,
    dateLabel: formatDateLabel(match.createdAt),
    typeLabel: match.type === 'BOT' ? 'vs Computador' : 'Online',
  };
}

export function useHistory(): HistoryState {
  const playerId = getStoredUserId();
  const { data, isLoading, isError } = useMatchHistory(playerId);

  const matches = useMemo<HistoryMatchView[]>(() => (data ?? []).map(toView), [data]);

  return {
    matches,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && matches.length === 0,
  };
}
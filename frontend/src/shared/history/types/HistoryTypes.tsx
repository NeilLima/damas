// ============================================
// Tipos do Histórico de Partidas
// ============================================

export type HistoryResult = 'win' | 'loss' | 'draw' | 'ongoing';

export interface HistoryMatch {
  id: string;
  type: 'BOT' | 'PVP';
  opponentId: string | null;
  result: HistoryResult;
  status: 'active' | 'over';
  createdAt: string;
}

export interface HistoryMatchView {
  key: string;
  opponentLabel: string;
  resultLabel: string;
  resultColor: string;
  dateLabel: string;
  typeLabel: string;
}

export interface HistoryState {
  matches: HistoryMatchView[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}
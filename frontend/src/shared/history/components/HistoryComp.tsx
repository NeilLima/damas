'use client';

import { useHistory } from '../utils/HistoryUtils';
import {
  StyledRoot,
  StyledTitle,
  StyledSubtitle,
  StyledList,
  StyledCard,
  StyledInfo,
  StyledOpponent,
  StyledMeta,
  StyledResult,
  StyledState,
} from '../styles/HistoryStyles';

export default function HistoryComp() {
  const { matches, isLoading, isError, isEmpty } = useHistory();

  return (
    <StyledRoot>
      <StyledTitle>Histórico de Partidas</StyledTitle>
      <StyledSubtitle>Suas partidas anteriores com resultado e data</StyledSubtitle>

      {isLoading && <StyledState>Carregando histórico…</StyledState>}
      {isError && <StyledState>Não foi possível carregar o histórico.</StyledState>}
      {isEmpty && <StyledState>Você ainda não jogou nenhuma partida.</StyledState>}

      <StyledList>
        {matches.map((m) => (
          <StyledCard key={m.key}>
            <StyledInfo>
              <StyledOpponent>{m.opponentLabel}</StyledOpponent>
              <StyledMeta>{m.typeLabel} · {m.dateLabel}</StyledMeta>
            </StyledInfo>
            <StyledResult $color={m.resultColor}>{m.resultLabel}</StyledResult>
          </StyledCard>
        ))}
      </StyledList>
    </StyledRoot>
  );
}

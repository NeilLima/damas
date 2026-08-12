'use client';

import { useState } from 'react';
import { useMultiplayer } from '../utils/MultiplayerUtils';
import {
  StyledRoot,
  StyledTitle,
  StyledSubtitle,
  StyledPanel,
  StyledInput,
  StyledButton,
  StyledSecondaryButton,
  StyledDangerButton,
  StyledError,
  StyledRoomCode,
  StyledStatus,
  StyledBoardGrid,
  StyledCell,
  StyledPiece,
  StyledValidMoveDot,
} from '../styles/MultiplayerStyles';

export default function MultiplayerComp() {
  const { state, actions, cellsData } = useMultiplayer();
  const [joinRoomId, setJoinRoomId] = useState('');
  const isMenu = state.phase === 'menu';

  const colorLabel = state.myColor === 'white' ? 'Brancas' : state.myColor === 'black' ? 'Pretas' : '—';
  const isMyTurn = state.phase === 'playing' && !!state.myColor && state.turn === state.myColor;
  const winnerLabel =
    state.phase === 'over'
      ? state.winner === state.myColor
        ? '🎉 Você venceu!'
        : state.winner
          ? '😞 Você perdeu'
          : 'Empate'
      : null;

  return (
    <StyledRoot>
      <StyledTitle>Multiplayer Online</StyledTitle>
      <StyledSubtitle>Jogue em tempo real com outro jogador</StyledSubtitle>

      {state.error && <StyledError>{state.error}</StyledError>}

      {isMenu && (
        <StyledPanel>
          <StyledButton onClick={actions.createRoom} disabled={!state.connected}>
            ➕ Criar nova partida
          </StyledButton>
          <StyledInput
            type="text"
            placeholder="Ou cole o código da sala"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
          />
          <StyledSecondaryButton
            onClick={() => joinRoomId.trim() && actions.joinRoom(joinRoomId.trim())}
            disabled={!state.connected || !joinRoomId.trim()}
          >
            🔑 Entrar na sala
          </StyledSecondaryButton>
          {!state.connected && <StyledStatus>Conectando ao servidor…</StyledStatus>}
        </StyledPanel>
      )}

      {state.phase === 'waiting' && (
        <StyledPanel>
          <StyledRoomCode>Código da sala: {state.roomId}</StyledRoomCode>
          <StyledStatus>Aguardando oponente entrar…</StyledStatus>
          <StyledDangerButton onClick={actions.leaveRoom}>Cancelar</StyledDangerButton>
        </StyledPanel>
      )}

      {(state.phase === 'playing' || state.phase === 'over') && state.board && (
        <StyledPanel>
          <StyledStatus>
            Você joga de <strong>{colorLabel}</strong> · {winnerLabel ?? (isMyTurn ? 'Sua vez' : 'Aguardando oponente…')}
          </StyledStatus>
        </StyledPanel>
      )}

      {(state.phase === 'playing' || state.phase === 'over') && (
        <StyledBoardGrid>
          {cellsData.map((cell) => (
            <StyledCell key={cell.key} $bg={cell.bg} onClick={cell.onClick}>
              {cell.piece && (
                <StyledPiece
                  type="button"
                  $isWhite={cell.piece.isWhite}
                  $isSelected={cell.piece.isSelected}
                  $isKing={cell.piece.isKing}
                  onClick={cell.piece.onClick}
                >
                  {cell.piece.isKing ? '♛' : ''}
                </StyledPiece>
              )}
              {cell.showValidDot && <StyledValidMoveDot />}
            </StyledCell>
          ))}
        </StyledBoardGrid>
      )}

      {state.phase === 'over' && (
        <StyledPanel>
          <StyledStatus>{winnerLabel ?? 'Partida encerrada'}</StyledStatus>
          <StyledButton onClick={actions.reset}>🔄 Jogar novamente</StyledButton>
          <StyledDangerButton onClick={actions.leaveRoom}>Sair da sala</StyledDangerButton>
        </StyledPanel>
      )}
    </StyledRoot>
  );
}

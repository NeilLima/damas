'use client';

import { useState } from 'react';

import { useGameBoardState, useGamePresentation } from '../utils/GameBoardUtils';
import { GameControlProvider, useGameControl } from '../utils/GameControlUtils';
import {
  StyledRoot,
  StyledBoardWrapper,
  StyledBoardArea,
  StyledBoardGrid,
  StyledLabelRow,
  StyledLabel,
  StyledSideLabel,
  StyledCell,
  StyledPiece,
  StyledPieceRing,
  StyledKingCrown,
  StyledKingHalo,
  StyledFireworks,
  StyledFireworkSpark,
  fireworkColors,
  StyledValidMoveDot,
  StyledLabelPlaceholder,
  StyledTurnIndicator,
  StyledControlBar,
  StyledButton,
  StyledResult,
  StyledModalOverlay,
  StyledModal,
  StyledModalHeader,
  StyledModalCrown,
  StyledModalTitle,
  StyledModalSubtitle,
  StyledModalSection,
  StyledSectionLabel,
  StyledModalRow,
  StyledOptionCard,
  StyledColorSwatch,
  StyledCheckmark,
  StyledStartButton,
  StyledHint,
  StyledPlayTip,
} from '../styles/GameBoardStyles';
import type { RenderPiece, RenderCell } from '../types/GameTypes';

function Piece2D({ piece }: { piece: RenderPiece }) {
  // Gera partículas de fogo de artifício ao redor da dama
  const sparks = piece.isKing
    ? Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 26 + (i % 4) * 7;
        return {
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          delay: (i % 6) * 0.18,
          size: 4 + (i % 3) * 2,
          color: fireworkColors[i % fireworkColors.length],
        };
      })
    : [];

  return (
    <StyledPiece
      $isWhite={piece.isWhite}
      $isSelected={piece.isSelected}
      $isKing={piece.isKing}
      onClick={(e) => {
        e.stopPropagation();
        piece.onClick();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        piece.onPointerDown(e);
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        piece.onPointerMove(e);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        piece.onPointerUp(e);
      }}
      onPointerCancel={(e) => {
        e.stopPropagation();
        piece.onPointerCancel(e);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        piece.onTouchStart(e);
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
        piece.onTouchMove(e);
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        piece.onTouchEnd(e);
      }}
      onDragStart={piece.onDragStart}
      onDragEnd={piece.onDragEnd}
      draggable
    >
      {piece.isKing && <StyledKingHalo />}
      {piece.isKing && (
        <StyledFireworks>
          {sparks.map((s, idx) => (
            <StyledFireworkSpark
              key={idx}
              $dx={s.dx}
              $dy={s.dy}
              $delay={s.delay}
              $size={s.size}
              $color={s.color}
            />
          ))}
        </StyledFireworks>
      )}
      <StyledPieceRing $isWhite={piece.isWhite} />
      {piece.isKing && <StyledKingCrown>♛</StyledKingCrown>}
    </StyledPiece>
  );
}

function Cell2D({ cell }: { cell: RenderCell }) {
  return (
    <StyledCell
      $bg={cell.bg}
      $hasPiece={!!cell.piece}
      $isPlayable={cell.isPlayable}
      onClick={cell.onClick}
      onPointerMove={cell.onPointerMove}
      onPointerUp={cell.onPointerUp}
      onDrop={cell.onDrop}
      onDragOver={cell.onDragOver}
      onTouchEnd={cell.onTouchEnd}
      onTouchMove={cell.onTouchMove}
      data-row={cell.key.split('-')[1]}
      data-col={cell.key.split('-')[2]}
    >
      {cell.piece && <Piece2D piece={cell.piece} />}
      {cell.showValidDot && <StyledValidMoveDot />}
    </StyledCell>
  );
}

export default function GameBoardComp() {
  return (
    <GameControlProvider>
      <GameBoardContent />
    </GameControlProvider>
  );
}

function GameBoardContent() {
  const { cellsData, pieceCount, letters, numbers } = useGameBoardState();
  const { state, actions } = useGameControl();
  const { difficultyOptions, colorOptions, isHumanTurn, resultLabel } = useGamePresentation();
  const [setupOpen, setSetupOpen] = useState(true);

  const handleStart = () => {
    actions.startNewGame();
    setSetupOpen(false);
  };

  return (
    <StyledRoot>
      <StyledBoardWrapper>
        <StyledControlBar>
          <StyledButton onClick={() => setSetupOpen(true)}>⚙ Configurações</StyledButton>
          <StyledButton onClick={actions.startNewGame}>Reiniciar</StyledButton>
        </StyledControlBar>

        <StyledTurnIndicator $active={isHumanTurn}>
          {state.result !== 'playing'
            ? '🏁 Fim de jogo'
            : state.isAiThinking
              ? '🤖 Computador pensando…'
              : isHumanTurn
                ? 'Sua vez'
                : 'Aguardando computador…'}
        </StyledTurnIndicator>

        {resultLabel && state.result !== 'playing' && (
          <StyledResult $winner={state.result === 'human_won'}>{resultLabel}</StyledResult>
        )}

        <StyledBoardArea>
          <StyledLabelRow>
            <StyledLabelPlaceholder />
            {letters.map((l) => (
              <StyledLabel key={l}>{l}</StyledLabel>
            ))}
            <StyledLabelPlaceholder />
          </StyledLabelRow>

          <StyledBoardGrid>
            {Array.from({ length: 8 }, (_, rowIdx) => (
              <div key={`row-${rowIdx}`} style={{ display: 'contents' }}>
                <StyledSideLabel>{numbers[rowIdx]}</StyledSideLabel>
                {cellsData.slice(rowIdx * 8, (rowIdx + 1) * 8).map((cell) => (
                  <Cell2D key={cell.key} cell={cell} />
                ))}
                <StyledSideLabel>{numbers[rowIdx]}</StyledSideLabel>
              </div>
            ))}
          </StyledBoardGrid>

          <StyledLabelRow>
            <StyledLabelPlaceholder />
            {letters.map((l) => (
              <StyledLabel key={l}>{l}</StyledLabel>
            ))}
            <StyledLabelPlaceholder />
          </StyledLabelRow>
        </StyledBoardArea>

        <StyledTurnIndicator>Peças: {pieceCount}</StyledTurnIndicator>
      </StyledBoardWrapper>

      {setupOpen && (
        <StyledModalOverlay onClick={() => setSetupOpen(false)}>
          <StyledModal onClick={(e) => e.stopPropagation()}>
            <StyledModalHeader>
              <StyledModalCrown>♛</StyledModalCrown>
              <StyledModalTitle>Damas</StyledModalTitle>
              <StyledModalSubtitle>Configure a partida antes de começar</StyledModalSubtitle>
            </StyledModalHeader>

            <StyledModalSection>
              <StyledSectionLabel>Dificuldade do computador</StyledSectionLabel>
              <StyledModalRow>
                {difficultyOptions.map((option) => {
                  const meta = {
                    easy: { emoji: '😊', accent: '#4caf50', label: 'Fácil' },
                    medium: { emoji: '🤔', accent: '#ff9800', label: 'Médio' },
                    hard: { emoji: '🤖', accent: '#e53935', label: 'Difícil' },
                  }[option.value];
                  return (
                    <StyledOptionCard
                      key={option.value}
                      type="button"
                      $active={state.difficulty === option.value}
                      $accent={meta.accent}
                      onClick={() => actions.setDifficulty(option.value)}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{meta.emoji}</span>
                      <span>{meta.label}</span>
                      {state.difficulty === option.value && <StyledCheckmark>✓</StyledCheckmark>}
                    </StyledOptionCard>
                  );
                })}
              </StyledModalRow>
            </StyledModalSection>

            <StyledModalSection>
              <StyledSectionLabel>Suas peças</StyledSectionLabel>
              <StyledModalRow>
                {colorOptions.map((option) => {
                  const isWhite = option.value === 'white';
                  const swatch = isWhite
                    ? 'radial-gradient(circle at 35% 30%, #ffffff, #dcdcdc)'
                    : 'radial-gradient(circle at 35% 30%, #4a4a4a, #0a0a0a)';
                  return (
                    <StyledOptionCard
                      key={option.value}
                      type="button"
                      $active={state.humanColor === option.value}
                      $accent={isWhite ? '#e0e0e0' : '#3a3a3a'}
                      onClick={() => actions.setHumanColor(option.value)}
                    >
                      <StyledColorSwatch $color={swatch} />
                      <span>Jogar de {option.label}</span>
                      {state.humanColor === option.value && <StyledCheckmark>✓</StyledCheckmark>}
                    </StyledOptionCard>
                  );
                })}
              </StyledModalRow>
            </StyledModalSection>

            <StyledPlayTip>
              <div className="tip-title">🎮 Como mover as peças</div>
              <p className="tip-text">
                <strong>Toque/clique</strong> na peça que deseja mover. Ela ficará destacada e os
                espaços para onde ela pode ir aparecerão marcados. Depois, <strong>toque/clique</strong> em
                um dos espaços marcados para fazer o movimento.
              </p>
            </StyledPlayTip>

            <StyledStartButton type="button" onClick={handleStart}>
              ▶ Jogar
            </StyledStartButton>

            <StyledHint>As brancas sempre começam a partida</StyledHint>
          </StyledModal>
        </StyledModalOverlay>
      )}
    </StyledRoot>
  );
}

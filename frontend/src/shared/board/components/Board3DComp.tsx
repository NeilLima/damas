'use client';

import { useBoard } from '../utils/BoardUtils';
import type { RenderPiece, RenderCell } from '../utils/BoardUtils';
import {
  StyledRoot,
  StyledBoardWrapper,
  StyledBoardGrid,
  StyledLabelRow,
  StyledLabel,
  StyledSideLabel,
  StyledCell,
  StyledPiece,
  StyledPieceRing,
  StyledKingCrown,
  StyledValidMoveDot,
  StyledLabelPlaceholder,
  StyledTurnIndicator,
} from '../styles/BoardStyles';

function Piece2D({ piece }: { piece: RenderPiece }) {
  return (
    <StyledPiece
      $isWhite={piece.isWhite}
      $isSelected={piece.isSelected}
      $isKing={piece.isKing}
      onClick={piece.onClick}
      onDragStart={piece.onDragStart}
      onDragEnd={piece.onDragEnd}
      draggable
    >
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

export default function Board3DComp() {
  const { cellsData, pieceCount, letters, numbers } = useBoard();

  return (
    <StyledRoot>
      <StyledTurnIndicator>Peças no tabuleiro: {pieceCount}</StyledTurnIndicator>
      <StyledBoardWrapper>
        <div>
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
        </div>
      </StyledBoardWrapper>
    </StyledRoot>
  );
}
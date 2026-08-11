import styled from 'styled-components';

export const StyledRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #2d5a27;
  box-sizing: border-box;
`;

export const StyledBoardWrapper = styled.div`
  width: 100%;
  max-width: 760px;
  padding: 16px;
  background: #3a6e31;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
`;

export const StyledBoardGrid = styled.div`
  display: grid;
  grid-template-columns: 30px repeat(8, 1fr) 30px;
  grid-template-rows: repeat(8, 1fr);
  width: 100%;
  aspect-ratio: 1.4;
  gap: 0;
`;

export const StyledLabelRow = styled.div`
  display: grid;
  grid-template-columns: 30px repeat(8, 1fr) 30px;
  width: 100%;
`;

export const StyledLabel = styled.div`
  text-align: center;
  font-size: clamp(10px, 1.5vw, 14px);
  font-weight: bold;
  color: #fff;
  padding: 2px 0;
`;

export const StyledSideLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(10px, 1.5vw, 14px);
  font-weight: bold;
  color: #fff;
`;

export const StyledCell = styled.div<{
  $bg: string;
  $hasPiece: boolean;
  $isPlayable: boolean;
}>`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$hasPiece || props.$isPlayable ? 'pointer' : 'default')};
  transition: background-color 0.15s ease;
  position: relative;
`;

export const StyledPiece = styled.div<{
  $isWhite: boolean;
  $isSelected: boolean;
  $isKing: boolean;
}>`
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: ${(props) =>
    props.$isWhite
      ? 'radial-gradient(circle at 40% 35%, #f5f5f5 0%, #e8e8e8 40%, #c0c0c0 70%, #b0b0b0 100%)'
      : 'radial-gradient(circle at 40% 35%, #3a3a3a 0%, #2a2a2a 40%, #1a1a1a 70%, #0a0a0a 100%)'};
  box-shadow: ${(props) =>
    props.$isSelected
      ? '0 0 0 3px #4a7c59, 0 4px 8px rgba(0,0,0,0.4)'
      : '0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.15)'};
  cursor: pointer;
  position: relative;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  transform: ${(props) => (props.$isSelected ? 'scale(1.08)' : 'scale(1)')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StyledPieceRing = styled.div<{ $isWhite: boolean }>`
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.$isWhite ? '#d0d0d0' : '#444')};
  background: transparent;
`;

export const StyledKingCrown = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #ffd700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: bold;
`;

export const StyledValidMoveDot = styled.div`
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
`;

export const StyledLabelPlaceholder = styled.div``;

export const StyledTurnIndicator = styled.div`
  margin-bottom: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4a90d9, #357abd);
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
`;
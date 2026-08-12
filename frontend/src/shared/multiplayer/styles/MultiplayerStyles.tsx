import styled from 'styled-components';

export const StyledRoot = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 16px;
  background: #1f1f1f;
  box-sizing: border-box;
  color: #fff;
`;

export const StyledTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
`;

export const StyledSubtitle = styled.p`
  margin: 0 0 24px;
  font-size: 0.95rem;
  color: #9a9aa5;
  text-align: center;
`;

export const StyledPanel = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  background: #2c2c2c;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #1a1a1a;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3a6ea5;
  }
`;

export const StyledButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1f;
  background: linear-gradient(135deg, #ffd977, #ffb347);
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledSecondaryButton = styled(StyledButton)`
  background: linear-gradient(135deg, #3a6ea5, #2c4a6e);
  color: #fff;
`;

export const StyledDangerButton = styled(StyledButton)`
  background: linear-gradient(135deg, #e53935, #b71c1c);
  color: #fff;
`;

export const StyledError = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(229, 57, 53, 0.15);
  color: #ff8a80;
  font-size: 0.9rem;
  text-align: center;
`;

export const StyledRoomCode = styled.div`
  margin: 8px 0;
  font-size: 1.1rem;
  text-align: center;
  color: #ffd977;
  font-weight: 700;
`;

export const StyledStatus = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #d0d0d8;
  text-align: center;
`;

export const StyledBoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: min(92vw, 520px);
  aspect-ratio: 1;
  border: 3px solid #2c2c2c;
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

export const StyledCell = styled.div<{ $bg: string }>`
  background-color: ${(props) => props.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

export const StyledPiece = styled.button<{
  $isWhite: boolean;
  $isSelected: boolean;
  $isKing: boolean;
}>`
  width: 82%;
  height: 82%;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.$isWhite ? '#2b2b2b' : '#e8e8e8')};
  background: ${(props) =>
    props.$isWhite
      ? 'radial-gradient(circle at 40% 35%, #ffffff 0%, #f0f0f0 40%, #dcdcdc 70%, #cfcfcf 100%)'
      : 'radial-gradient(circle at 40% 35%, #4a4a4a 0%, #2c2c2c 40%, #151515 70%, #050505 100%)'};
  box-shadow: ${(props) =>
    props.$isSelected ? '0 0 0 3px #3a6ea5, 0 4px 8px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.4)'};
  transform: ${(props) => (props.$isSelected ? 'scale(1.08)' : 'scale(1)')};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: ${(props) => (props.$isWhite ? '#ffd977' : '#ffb347')};
  cursor: pointer;
  padding: 0;
`;

export const StyledValidMoveDot = styled.div`
  position: absolute;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
`;

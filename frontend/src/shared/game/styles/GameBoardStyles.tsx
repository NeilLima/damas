import styled, { keyframes } from 'styled-components';

export const StyledRoot = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  background: #1f1f1f;
  box-sizing: border-box;
  overflow: hidden;
`;

export const StyledBoardWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  padding: 8px;
  background: #2c2c2c;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

/** Área flexível que reserva espaço pros controles e abriga o tabuleiro. */
export const StyledBoardArea = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  box-sizing: border-box;
`;

export const StyledBoardGrid = styled.div`
  display: grid;
  grid-template-columns: 18px repeat(8, 1fr) 18px;
  grid-template-rows: repeat(8, 1fr);
  /* Largura maior que a altura (tabuleiro mais "largo") */
  height: calc(100dvh - 200px);
  width: min(100vw, calc((100dvh - 200px) * 1.6));
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
  gap: 0;
`;

export const StyledLabelRow = styled.div`
  display: grid;
  grid-template-columns: 18px repeat(8, 1fr) 18px;
  width: min(100vw, calc((100dvh - 200px) * 1.6));
  max-width: 100%;
  flex-shrink: 0;
  margin: 0 auto;
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

export const StyledLabelPlaceholder = styled.div``;

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
      ? 'radial-gradient(circle at 40% 35%, #ffffff 0%, #f0f0f0 40%, #dcdcdc 70%, #cfcfcf 100%)'
      : 'radial-gradient(circle at 40% 35%, #4a4a4a 0%, #2c2c2c 40%, #151515 70%, #050505 100%)'};
  box-shadow: ${(props) =>
    props.$isSelected
      ? '0 0 0 3px #3a6ea5, 0 4px 8px rgba(0,0,0,0.5)'
      : '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.12)'};
  border: 2px solid ${(props) => (props.$isWhite ? '#2b2b2b' : '#e8e8e8')};
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
  border: 2px solid ${(props) => (props.$isWhite ? '#2b2b2b' : '#e8e8e8')};
  background: transparent;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const crownBounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  40% { transform: translateY(-8px) rotate(-3deg); }
  60% { transform: translateY(-3px) rotate(3deg); }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const crownFloat = keyframes`
  0%, 100% { transform: translate(-50%, 0) rotate(-4deg); }
  50% { transform: translate(-50%, -6px) rotate(4deg); }
`;

const haloPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.65; }
  50% { transform: scale(1.25); opacity: 1; }
`;

export const StyledKingCrown = styled.div`
  position: absolute;
  top: -18%;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 28px;
  line-height: 1;
  color: #ffd700;
  text-shadow:
    0 0 8px rgba(255, 215, 0, 0.95),
    0 0 18px rgba(255, 215, 0, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.6);
  font-weight: bold;
  animation: ${crownFloat} 2s ease-in-out infinite;
  z-index: 2;
  pointer-events: none;
`;

export const StyledKingHalo = styled.div`
  position: absolute;
  inset: -15%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.55) 0%, rgba(255, 165, 0, 0.2) 55%, transparent 70%);
  animation: ${haloPulse} 1.6s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
  mix-blend-mode: screen;
`;

// ---------- Fogos de artifício na dama ----------
const fireworkColors = ['#ff4d4d', '#ffd700', '#4dd2ff', '#7dff7d', '#ff8cff', '#ffa64d'];

const fireworkSpark = keyframes`
  0% { transform: translate(0, 0) scale(0.2); opacity: 0; }
  20% { opacity: 1; }
  60% { transform: translate(var(--dx), var(--dy)) scale(0.9); opacity: 1; }
  100% { transform: translate(calc(var(--dx) * 1.15), calc(var(--dy) * 1.15)) scale(0.2); opacity: 0; }
`;

export const StyledFireworks = styled.div`
  position: absolute;
  inset: -40%;
  pointer-events: none;
  z-index: 3;
`;

export const StyledFireworkSpark = styled.div<{
  $dx: number;
  $dy: number;
  $delay: number;
  $size: number;
  $color: string;
}>`
  --dx: ${(p) => p.$dx}px;
  --dy: ${(p) => p.$dy}px;
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  box-shadow: 0 0 6px ${(p) => p.$color}, 0 0 12px ${(p) => p.$color};
  animation: ${fireworkSpark} 1.1s ease-out infinite;
  animation-delay: ${(p) => p.$delay}s;
`;

export { fireworkColors };

export const StyledValidMoveDot = styled.div`
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.35);
`;

export const StyledTurnIndicator = styled.div<{ $active?: boolean }>`
  margin-bottom: 12px;
  padding: 10px 20px;
  background: ${(props) =>
    props.$active
      ? 'linear-gradient(135deg, #4a90d9, #357abd)'
      : 'linear-gradient(135deg, #666, #444)'};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 8px 14px;
  }
`;

export const StyledControlBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

export const StyledButton = styled.button<{ $active?: boolean }>`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: ${(props) => (props.$active ? '#3a6ea5' : '#3a3a3a')};
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledResult = styled.div<{ $winner?: boolean }>`
  margin: 12px 0;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  background: ${(props) =>
    props.$winner
      ? 'linear-gradient(135deg, #4caf50, #2e7d32)'
      : 'linear-gradient(135deg, #e53935, #b71c1c)'};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

// ============================================
// Modal de configuração inicial
// ============================================
export const StyledModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 8, 12, 0.82);
  backdrop-filter: blur(10px) saturate(0.6);
  -webkit-backdrop-filter: blur(10px) saturate(0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
  box-sizing: border-box;
  animation: fadeIn 0.25s ease-out;
`;

export const StyledModal = styled.div`
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  overflow-y: auto;
  background: linear-gradient(160deg, #2f2f38 0%, #232329 55%, #1b1b20 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  padding: 32px 28px;
  box-shadow:
    0 30px 90px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
  text-align: center;
  animation: modalIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.18);

  @media (max-width: 480px) {
    padding: 24px 18px;
    border-radius: 16px;
  }
`;

export const StyledModalHeader = styled.div`
  margin-bottom: 24px;
`;

export const StyledModalCrown = styled.div`
  font-size: 3.2rem;
  line-height: 1;
  margin-bottom: 8px;
  animation: crownBounce 2.4s ease-in-out infinite;
  filter: drop-shadow(0 0 16px rgba(255, 200, 0, 0.55));
`;

export const StyledModalTitle = styled.h1`
  margin: 0 0 6px;
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #ffffff, #ffd977);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const StyledModalSubtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #9a9aa5;
`;

export const StyledModalSection = styled.div`
  margin-bottom: 22px;
  text-align: left;
`;

export const StyledSectionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #e8e8ee;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), transparent);
  }
`;

export const StyledModalRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledOptionCard = styled.button<{
  $active?: boolean;
  $accent?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 14px 14px;
  border-radius: 14px;
  border: 2px solid ${(props) => (props.$active ? (props.$accent || '#3a6ea5') : 'rgba(255,255,255,0.1)')};
  background: ${(props) =>
    props.$active
      ? `linear-gradient(135deg, ${props.$accent ? props.$accent + '33' : 'rgba(58,110,165,0.4)'}, rgba(255,255,255,0.06))`
      : 'rgba(255,255,255,0.05)'};
  color: #fff;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  box-shadow: ${(props) =>
    props.$active ? 'inset 0 1px 0 rgba(255,255,255,0.15)' : 'none'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

export const StyledColorSwatch = styled.span<{ $color: string }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${(props) => props.$color};
  border: 2px solid rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
`;

export const StyledCheckmark = styled.span`
  margin-left: auto;
  color: #4caf50;
  font-size: 1.1rem;
  font-weight: 800;
`;

export const StyledStartButton = styled.button`
  margin-top: 10px;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1a1a1f;
  background: linear-gradient(135deg, #ffd977, #ffb347);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  box-shadow: 0 8px 24px rgba(255, 179, 71, 0.35);
  letter-spacing: 0.02em;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
    box-shadow: 0 12px 32px rgba(255, 179, 71, 0.45);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StyledHint = styled.p`
  margin: 12px 0 0;
  font-size: 0.8rem;
  color: #7a7a86;
  text-align: center;
`;

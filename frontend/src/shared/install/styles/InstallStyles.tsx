// ============================================
// Estilos do prompt de instalação PWA
// ============================================
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const StyledInstallOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

export const StyledInstallCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: linear-gradient(160deg, #2f2f38 0%, #232329 55%, #1b1b20 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  padding: 28px 24px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
  animation: ${slideUp} 0.28s cubic-bezier(0.18, 0.89, 0.32, 1.18);
  text-align: center;
`;

export const StyledInstallIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`;

export const StyledInstallTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
`;

export const StyledInstallText = styled.p`
  margin: 0 0 22px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #b8b8c3;
`;

export const StyledInstallButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledInstallPrimary = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a1a1f;
  background: linear-gradient(135deg, #ffd977, #ffb347);
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StyledInstallSecondary = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: #c8c8d2;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const StyledInstallBanner = styled.button`
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: linear-gradient(135deg, #2f2f38 0%, #232329 100%);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
  text-align: left;
  animation: ${slideUp} 0.3s ease;

  .banner-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .banner-icon {
    font-size: 1.5rem;
  }

  .banner-text {
    font-size: 0.92rem;
    font-weight: 600;
  }

  .banner-action {
    flex-shrink: 0;
    padding: 8px 14px;
    border-radius: 10px;
    background: linear-gradient(135deg, #ffd977, #ffb347);
    color: #1a1a1f;
    font-size: 0.85rem;
    font-weight: 800;
  }

  &:hover {
    filter: brightness(1.06);
  }
`;

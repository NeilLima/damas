import styled from 'styled-components';

export const StyledRoot = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: #1f1f1f;
  box-sizing: border-box;
  color: #fff;
`;

export const StyledTitle = styled.h1`
  margin: 0 0 4px;
  font-size: 1.8rem;
  font-weight: 800;
  text-align: center;
`;

export const StyledSubtitle = styled.p`
  margin: 0 0 24px;
  font-size: 0.95rem;
  color: #9a9aa5;
  text-align: center;
`;

export const StyledList = styled.div`
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  background: #2c2c2c;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
`;

export const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledOpponent = styled.span`
  font-size: 1rem;
  font-weight: 700;
`;

export const StyledMeta = styled.span`
  font-size: 0.82rem;
  color: #9a9aa5;
`;

export const StyledResult = styled.span<{ $color: string }>`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${(props) => props.$color};
  white-space: nowrap;
`;

export const StyledState = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #d0d0d8;
  text-align: center;
`;

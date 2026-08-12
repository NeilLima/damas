import styled from 'styled-components';

export const StyledAuthRoot = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: #1f1f1f;
  box-sizing: border-box;
  color: #fff;
`;

export const StyledAuthCard = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px 24px;
  background: #2c2c2c;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
`;

export const StyledAuthTitle = styled.h1`
  margin: 0 0 4px;
  font-size: 1.6rem;
  font-weight: 800;
  text-align: center;
`;

export const StyledAuthSubtitle = styled.p`
  margin: 0 0 8px;
  font-size: 0.95rem;
  color: #9a9aa5;
  text-align: center;
`;

export const StyledField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #d0d0d8;
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

export const StyledSubmit = styled.button`
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

export const StyledMessage = styled.p<{ $error: boolean }>`
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${(props) => (props.$error ? 'rgba(229,57,53,0.15)' : 'rgba(76,175,80,0.15)')};
  color: ${(props) => (props.$error ? '#ff8a80' : '#81c784')};
  font-size: 0.9rem;
  text-align: center;
`;

export const StyledAuthLink = styled.a`
  display: block;
  text-align: center;
  font-size: 0.9rem;
  color: #3a6ea5;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

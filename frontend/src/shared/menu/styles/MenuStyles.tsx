import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
  gap: 32px;

  @media (min-width: 768px) {
    gap: 48px;
  }
`;

export const StyledTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;

  @media (min-width: 768px) {
    max-width: 400px;
    gap: 20px;
  }
`;

export const StyledMenuButton = styled.button`
  background: ${(props) =>
    `linear-gradient(${props.theme.gradientDirection}, ${props.theme.primaryColor}, ${props.theme.secondaryColor})`};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.boxShadow};
  color: ${(props) => props.theme.textColor};
  padding: 20px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.boxShadowHover};
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    padding: 24px 32px;
    font-size: 1.25rem;
  }
`;

export const StyledLogoutButton = styled.button`
  width: 100%;
  max-width: 320px;
  padding: 14px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(229, 57, 53, 0.15);
  color: #ff8a80;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background: rgba(229, 57, 53, 0.28);
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    max-width: 400px;
  }
`;
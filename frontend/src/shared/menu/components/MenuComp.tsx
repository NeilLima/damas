'use client';

import { useMenu } from '../utils/MenuUtils';
import {
  StyledContainer,
  StyledTitle,
  StyledButtonGroup,
  StyledMenuButton,
} from '../styles/MenuStyles';
import type { MenuButton } from '../types/MenuTypes';

export default function MenuComp() {
  const { state, actions } = useMenu();

  return (
    <StyledContainer>
      <StyledTitle>Jogo de Damas</StyledTitle>
      <StyledButtonGroup>
        {state.buttons.map((button: MenuButton) => (
          <StyledMenuButton
            key={button.route}
            data-testid={`menu-button-${button.label}`}
            onClick={() => actions.handleNavigate(button.route)}
            disabled={state.isLoading}
          >
            {button.label}
          </StyledMenuButton>
        ))}
      </StyledButtonGroup>
    </StyledContainer>
  );
}
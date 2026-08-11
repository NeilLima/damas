'use client';

import React from 'react';
import { ThemeProvider, useTheme } from '@/context/theme/ThemeContext';
import GlobalStyles from '@/styles/GlobalStyles';
import StyledComponentsRegistry from '@/lib/registry';

function GlobalStylesWithTheme() {
  const { theme } = useTheme();
  return <GlobalStyles $bg={theme.backgroundColor} $color={theme.textColor} />;
}

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <GlobalStylesWithTheme />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
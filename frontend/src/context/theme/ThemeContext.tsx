'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  gradientDirection: string;
  backgroundColor: string;
  textColor: string;
  boxShadow: string;
  boxShadowHover: string;
  borderRadius: string;
}

const defaultTheme: Theme = {
  primaryColor: '#1a1a2e',
  secondaryColor: '#16213e',
  gradientDirection: '45deg',
  backgroundColor: '#0f0f23',
  textColor: '#ffffff',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  boxShadowHover: '0 12px 40px rgba(0, 0, 0, 0.5)',
  borderRadius: '20px',
};

interface ThemeContextData {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({
  theme: defaultTheme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) =>
      prev.primaryColor === '#1a1a2e'
        ? {
            primaryColor: '#f0f0f0',
            secondaryColor: '#ffffff',
            gradientDirection: '45deg',
            backgroundColor: '#e0e0e0',
            textColor: '#1a1a2e',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            boxShadowHover: '0 12px 40px rgba(0, 0, 0, 0.2)',
            borderRadius: '20px',
          }
        : defaultTheme
    );
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
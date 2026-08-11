'use client';

import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'laptop' | 'desktop';

/**
 * Hook para detectar o tamanho da tela e retornar informações de responsividade
 * @returns {Object} - Informações sobre o tamanho da tela e breakpoints
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    if (width < 576) return 'mobile';
    if (width < 768) return 'tablet';
    if (width < 1024) return 'laptop';
    return 'desktop';
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    
    const handleResize = (): void => {
      // Debounce para evitar re-renderizações excessivas
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        setWindowSize((prevSize) => {
          // Só atualizar se houve mudança significativa (mais de 10px)
          if (Math.abs(prevSize.width - width) < 10 && Math.abs(prevSize.height - height) < 10) {
            return prevSize;
          }
          return { width, height };
        });
        
        const newBreakpoint: Breakpoint = width < 576 ? 'mobile' : 
                             width < 768 ? 'tablet' : 
                             width < 1024 ? 'laptop' : 'desktop';
        
        setBreakpoint((prevBreakpoint) => {
          // Só atualizar se o breakpoint realmente mudou
          return prevBreakpoint !== newBreakpoint ? newBreakpoint : prevBreakpoint;
        });
      }, 150); // Debounce de 150ms
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  
  return {
    width: windowSize.width,
    height: windowSize.height,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isLaptop: breakpoint === 'laptop',
    isDesktop: breakpoint === 'desktop'
  };
};

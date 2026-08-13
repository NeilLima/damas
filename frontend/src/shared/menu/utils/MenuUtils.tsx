'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { menuRoutes } from '../routes/MenuRoutes';
import { clearSession, getStoredUserId } from '@/shared/auth/services/AuthServices';
import type { MenuButton, MenuState, MenuActions } from '../types/MenuTypes';

// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const MENU_BUTTONS: MenuButton[] = [
  { label: 'Jogar vs Computador', route: menuRoutes.game },
  {
    label: 'Jogar Online',
    route: menuRoutes.multiplayer,
    disabled: true,
    note: '⏳ Em implementação',
  },
  { label: 'Histórico', route: menuRoutes.history },
];

// ============================================
// 2️⃣ ESTADOS + 3️⃣ OBJETOS + 4️⃣ FUNÇÕES
// ============================================
export function useMenu(): { state: MenuState; actions: MenuActions } {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getStoredUserId());

  const handleNavigate = useCallback(
    (route: string) => {
      setIsLoading(true);
      router.push(route);
    },
    [router],
  );

  const handleLogout = useCallback(() => {
    clearSession();
    setIsAuthenticated(false);
    router.push('/');
  }, [router]);

  const state: MenuState = {
    buttons: MENU_BUTTONS,
    isLoading,
    isAuthenticated,
  };

  const actions: MenuActions = {
    handleNavigate,
    handleLogout,
  };

  return { state, actions };
}

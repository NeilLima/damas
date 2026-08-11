'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { menuRoutes } from '../routes/MenuRoutes';
import type { MenuButton, MenuState, MenuActions } from '../types/MenuTypes';

// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const MENU_BUTTONS: MenuButton[] = [
  { label: 'Jogar vs Computador', route: menuRoutes.game },
  { label: 'Jogar Online', route: menuRoutes.multiplayer },
  { label: 'Histórico', route: menuRoutes.history },
];

// ============================================
// 2️⃣ ESTADOS + 3️⃣ OBJETOS + 4️⃣ FUNÇÕES
// ============================================
export function useMenu(): { state: MenuState; actions: MenuActions } {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = useCallback(
    (route: string) => {
      setIsLoading(true);
      router.push(route);
    },
    [router]
  );

  const state: MenuState = {
    buttons: MENU_BUTTONS,
    isLoading,
  };

  const actions: MenuActions = {
    handleNavigate,
  };

  return { state, actions };
}
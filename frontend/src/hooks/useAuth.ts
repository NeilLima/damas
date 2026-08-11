import { useMemo } from 'react';

/**
 * Hook de autenticação customizado - retorna dados do localStorage
 * Não usa next-auth, usa autenticação JWT customizada
 */
export function useAuth() {
  const userId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const localId = localStorage.getItem('userId');
    if (localId && localId !== 'undefined' && localId !== 'null') {
      return localId;
    }
    return null;
  }, []);

  const accessToken = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const localToken = localStorage.getItem('token');
    if (localToken) return localToken;
    return null;
  }, []);

  const isAuthenticated = useMemo(() => {
    return !!userId && !!accessToken;
  }, [userId, accessToken]);

  return {
    user: null,
    userId,
    accessToken,
    isAuthenticated,
    status: isAuthenticated ? 'authenticated' : 'unauthenticated',
    session: null,
  };
}

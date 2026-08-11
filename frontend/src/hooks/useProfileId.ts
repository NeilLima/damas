import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook para extrair o profileId da URL e identificar o contexto de perfil.
 * @param {string|undefined} overrideProfileId - Permite sobrescrever o profileId manualmente.
 * @returns {{ profileId: string | null, isOwnProfile: boolean }}
 */
export function useProfileId(overrideProfileId?: string | null): { profileId: string | null; isOwnProfile: boolean } {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userId } = useAuth();

  // Calcula o profileId de forma memorizada
  const profileId = useMemo(() => {
    if (overrideProfileId !== undefined) {
      return overrideProfileId;
    }
    const idFromQuery = searchParams.get('id');
    if (idFromQuery) return idFromQuery;
        const match = pathname.match(/\/(profile|user)\/([\w-]+)/);
    return match?.[2] || null;
  }, [overrideProfileId, pathname, searchParams]);

  // Calcula isOwnProfile de forma memorizada
  const isOwnProfile = useMemo(() => {
    return !!(profileId && userId && profileId === userId);
  }, [profileId, userId]);

  return { profileId, isOwnProfile };
}

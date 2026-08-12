'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MultiplayerComp from '@/shared/multiplayer/components/MultiplayerComp';
import { getStoredUserId } from '@/shared/auth/services/AuthServices';

export default function MultiplayerPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getStoredUserId()) {
      router.replace('/login');
    }
  }, [router]);

  return <MultiplayerComp />;
}

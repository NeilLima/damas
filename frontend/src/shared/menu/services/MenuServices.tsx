'use client';

import { api } from '@/api/api';

export function getServerStatus() {
  return api.get('/health').then((res: unknown) => (res as { data: unknown }).data);
}
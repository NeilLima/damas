// ============================================
// AuthServices - chamadas de API de autenticação
// (login/registro + persistência em localStorage)
// ============================================
import { api } from '@/api/api';
import type { AuthResponse, LoginInput, RegisterInput } from '../types/AuthTypes';

const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';

export async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', input);
  return res.data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', input);
  return res.data;
}

export function persistSession(auth: AuthResponse): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(USER_ID_KEY, String(auth.user.id));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem('nextauth.session');
}

export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
}

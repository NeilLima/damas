'use client';

// ============================================
// AuthUtils - estado do formulário de autenticação
// ============================================
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, login, persistSession, register } from '../services/AuthServices';
import type { AuthFormMode, AuthFormState, AuthReturn } from '../types/AuthTypes';

const EMPTY_FIELD = { value: '', error: undefined };

const INITIAL_STATE: AuthFormState = {
  email: { ...EMPTY_FIELD },
  password: { ...EMPTY_FIELD },
  firstName: { ...EMPTY_FIELD },
  lastName: { ...EMPTY_FIELD },
};

export function useAuthForm(mode: AuthFormMode): AuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthFormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = useCallback(
    (field: keyof AuthFormState) => (value: string) => {
      setState((prev) => ({ ...prev, [field]: { value, error: undefined } }));
    },
    [],
  );

  const handleLogout = useCallback(() => {
    clearSession();
    router.push('/');
  }, [router]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setMessage(null);
    setIsError(false);
    try {
      let email = state.email.value.trim();
      const password = state.password.value;
      const firstName = state.firstName.value.trim();
      const lastName = state.lastName.value.trim();

      if (!email || !password) {
        setMessage('Preencha e-mail e senha.');
        setIsError(true);
        return;
      }

      if (mode === 'login') {
        const auth = await login({ email, password });
        persistSession(auth);
        setMessage('Login realizado com sucesso!');
        router.push('/');
      } else {
        if (!firstName || !lastName) {
          setMessage('Preencha nome e sobrenome.');
          setIsError(true);
          return;
        }
        const auth = await register({ firstName, lastName, email, password });
        persistSession(auth);
        setMessage('Conta criada com sucesso!');
        router.push('/');
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: unknown } } };
      const raw = err?.response?.data?.message;
      const msg = Array.isArray(raw) ? (raw as string[]).join(', ') : typeof raw === 'string' ? raw : 'Falha na autenticação.';
      setMessage(msg);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }, [mode, state, router]);

  const actions = useMemo(
    () => ({ handleChange, handleSubmit, handleLogout }),
    [handleChange, handleSubmit, handleLogout],
  );

  return { mode, state, actions, submitting, message, isError };
}

// ============================================
// Tipos do Auth Frontend (Login/Registro)
// ============================================

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryIso2?: string;
  city?: string;
  gender?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthFormField {
  value: string;
  error?: string;
}

export interface AuthFormState {
  email: AuthFormField;
  password: AuthFormField;
  firstName: AuthFormField;
  lastName: AuthFormField;
}

export type AuthFormMode = 'login' | 'register';

export interface AuthActions {
  handleChange: (field: keyof AuthFormState) => (value: string) => void;
  handleSubmit: () => Promise<void>;
  handleLogout: () => void;
}

export interface AuthReturn {
  mode: AuthFormMode;
  state: AuthFormState;
  actions: AuthActions;
  submitting: boolean;
  message: string | null;
  isError: boolean;
}

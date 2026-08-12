'use client';

import { useAuthForm } from '../utils/AuthUtils';
import type { AuthFormMode, AuthFormState } from '../types/AuthTypes';
import { authRoutes } from '../routes/AuthRoutes';
import {
  StyledAuthRoot,
  StyledAuthCard,
  StyledAuthTitle,
  StyledAuthSubtitle,
  StyledField,
  StyledInput,
  StyledSubmit,
  StyledMessage,
  StyledAuthLink,
} from '../styles/AuthStyles';

interface AuthCompProps {
  mode: AuthFormMode;
}

export default function AuthComp({ mode }: AuthCompProps) {
  const { state, actions, submitting, message, isError } = useAuthForm(mode);

  const isLogin = mode === 'login';
  const title = isLogin ? 'Entrar' : 'Criar conta';
  const subtitle = isLogin ? 'Acesse sua conta para jogar online' : 'Cadastre-se para competir online';

  const handle = (field: keyof AuthFormState) => ({
    value: state[field].value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => actions.handleChange(field)(e.target.value),
  });

  return (
    <StyledAuthRoot>
      <StyledAuthCard>
        <StyledAuthTitle>{title}</StyledAuthTitle>
        <StyledAuthSubtitle>{subtitle}</StyledAuthSubtitle>

        {!isLogin && (
          <>
            <StyledField>
              Nome
              <StyledInput type="text" placeholder="Seu nome" {...handle('firstName')} />
            </StyledField>
            <StyledField>
              Sobrenome
              <StyledInput type="text" placeholder="Seu sobrenome" {...handle('lastName')} />
            </StyledField>
          </>
        )}

        <StyledField>
          E-mail
          <StyledInput type="email" placeholder="voce@email.com" {...handle('email')} />
        </StyledField>

        <StyledField>
          Senha
          <StyledInput type="password" placeholder="••••••••" {...handle('password')} />
        </StyledField>

        {message && <StyledMessage $error={isError}>{message}</StyledMessage>}

        <StyledSubmit type="button" onClick={actions.handleSubmit} disabled={submitting}>
          {submitting ? 'Aguarde…' : isLogin ? 'Entrar' : 'Criar conta'}
        </StyledSubmit>

        <StyledAuthLink href={isLogin ? authRoutes.register : authRoutes.login}>
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </StyledAuthLink>
      </StyledAuthCard>
    </StyledAuthRoot>
  );
}

---
id: "autenticacao-frontend"
status: "backlog"
priority: "high"
assignee: "victor"
epic: "multiplayer"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-11T22:05:00.000Z"
completedAt: null
labels: [frontend, auth]
order: "a60"
---
# Autenticação no Frontend (Login/Registro)

## Descrição
Criar telas de login/registro consumindo `/auth/login` e `/auth/register` para permitir "Jogar Online" com usuários criados.

## A fazer
- Tela de login consumindo `POST /auth/login` e salvando `token`/`userId` no localStorage
- Tela de registro consumindo `POST /auth/register`
- Ajustar `useAuth.ts` para ler os dados corretos do usuário logado
- Exigir login para acessar `/multiplayer`
- Botões de logout

## Critério de aceite
Usuário cria conta, faz login e pode jogar online identificado.
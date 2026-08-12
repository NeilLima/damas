# Documentação Geral - Frontend Nexus Social

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Regras e Convenções](#regras-e-convenções)
- [Tecnologias](#tecnologias)
- [Fluxo de Comunicação](#fluxo-de-comunicação)
- [Sistema de Tipos](#sistema-de-tipos)
- [Sistema de Tema](#sistema-de-tema)
- [TanStack Query](#tanstack-query)
- [Componentes](#componentes)
- [Rotas](#rotas)
- [Testes](#testes)
- [Deploy](#deploy)

---
nao coloque /* eslint-disable prettier/prettier */
nas pagina frontend so backend 

## Visão Geral

O frontend do Nexus Social é uma aplicação React/Next.js que segue uma arquitetura estrita e modular. O projeto foca em separação clara de responsabilidades, type-safety com TypeScript, e uma experiência de usuário consistente através de um sistema de temas unificado.

**Características Principais:**
- ✅ Arquitetura estrita: Component → Utils → Services → crudServices
- ✅ TypeScript para type-safety
- ✅ TanStack Query no Services para gerenciamento de estado e cache
- ✅ Styled-components para estilização
- ✅ Sistema de temas dinâmico
- ✅ Responsividade mobile-first
- ✅ Performance otimizada

---

## Arquitetura

### Fluxo de Comunicação

```
COMPONENT → UTILS → SERVICES → CRUDSERVICES (Global)
   ↓          ↓        ↓           ↓
 Render  Business  TanStack     API Calls
  Only    Logic    Query +      (create, update, etc.)
                   HTTP
```

### Camadas da Arquitetura

1. **Component Layer** (`components/`)
   - Apenas renderização e TSX
   - Sem lógica de negócio
   - Sem estados (useState, useEffect)
   - Sem estilos inline
   - Consome apenas UTILS

2. **Utils Layer** (`utils/`)
   - Organização estrita: **variáveis → estados → objetos → funções**
   - Variáveis e constantes
   - Estados (useState, useReducer)
   - Effects (useEffect, useLayoutEffect)
   - Objetos, mapeamentos, JSON
   - Lógica de negócio (funções)
   - Hooks customizados
   - Consome apenas SERVICES

3. **Services Layer** (`services/`)
   - TanStack Query (useQuery, useMutation, useInfiniteQuery)
   - Requisições HTTP
   - Consome crudServices global
   - Transformação de dados da API
   - Mocks para desenvolvimento
   - Cache e invalidação

4. **Styles Layer** (`styles/`)
   - Styled-components
   - Temas e variáveis
   - Animações e transições
   - Responsividade

5. **Types Layer** (`types/`)
   - Interfaces TypeScript
   - Tipos de dados
   - Props de componentes
   - Contratos de API
   - **NUNCA colocar tipagens diretamente no Service ou no Utils**

6. **Routes Layer** (`routes/`)
   - Definições de rotas
   - Navegação e links
   - Configuração de páginas

7. **Test Layer** (`test/`)
   - Testes unitários
   - Testes de integração
   - Testes E2E
   - Mocks e fixtures

---

## Estrutura de Diretórios

### Estrutura Global

```
frontend/
├── 📁 src/
│   ├── 📁 api/               # URLs da API
│   ├── 📁 app/               # App Router (Next.js)
│   ├── 📁 assets/            # Arquivos estáticos
│   ├── 📁 components/        # Componentes globais reutilizáveis
│   ├── 📁 context/            # Contextos globais (Theme, Auth)
│   ├── 📁 hooks/             # Hooks globais customizados
│   ├── 📁 id/                # Utilitários de ID
│   ├── 📁 scripts/           # Scripts de automação
│   ├── 📁 services/          # Serviços globais
│   ├── 📁 shared/            # Componentes compartilhados por feature
│   ├── 📁 styles/            # Estilos globais
│   ├── 📁 theme/             # Configurações de tema
│   ├── 📁 types/             # Tipos globais
│   ├── 📁 utils/             # Utilitários globais
│   ├── 📄 i18n.ts            # Internacionalização
│   └── 📄 layout.tsx         # Layout raiz
├── 📁 public/                # Arquivos públicos
├── 📄 .env                   # Variáveis de ambiente
├── 📄 package.json           # Dependências
└── 📄 tsconfig.json          # Configuração TypeScript
```

### Estrutura de Componentes Compartilhados

```
shared/
├── 📁 post/                  # Posts (Feed, Cards, etc.)
│   ├── 📁 card/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── test/
│   ├── 📁 create-text/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── test/
│   └── ...
├── 📁 stories/               # Stories
├── 📁 comments/              # Comentários
├── 📁 gallery/               # Galeria
├── 📁 notifications/         # Notificações
├── 📁 profile/               # Perfil
└── ...
```

### Estrutura Padrão de Cada Diretório

```
NomeDoDiretorio/
├── components/
│   └── NomeDoDiretorioComp.tsx
├── utils/
│   └── NomeDoDiretorioUtils.tsx
├── styles/
│   └── NomeDoDiretorioStyles.tsx
├── routes/
│   └── NomeDoDiretorioRoutes.tsx
├── services/
│   └── NomeDoDiretorioServices.tsx
├── types/
│   └── NomeDoDiretorioTypes.tsx
└── test/
    └── NomeDoDiretorio.test.tsx
```

---

## Regras e Convenções

### Regras Principais

1. **Fluxo de comunicação estrito**
   - ❌ NUNCA usar crudServices diretamente no utils
   - ❌ NUNCA usar api/ ou id/ diretamente (crudServices já os inclui)
   - ✅ crudServices → services → utils → component
   - ✅ Services do componente consome crudServices global
   - ✅ Utils consome services do próprio componente
   - ✅ Component consome utils do próprio componente

2. **Organização do Utils Layer**
   - A ordem dentro de cada arquivo Utils deve seguir:
     1. **Variáveis** - constantes, configurações, enums
     2. **Estados** - useState, useReducer, variáveis reativas
     3. **Objetos** - mapeamentos, objetos de configuração, JSON
     4. **Funções** - lógica de negócio, handlers, callbacks
   - ❌ NUNCA colocar TanStack Query no Utils
   - ❌ NUNCA colocar tipagens diretamente no Utils

3. **TanStack Query no Services**
   - ✅ useQuery, useMutation, useInfiniteQuery SOMENTE no Services
   - ✅ Services gerencia cache e requisições
   - ❌ NUNCA usar TanStack Query no Utils

4. **Tipagens nos Types**
   - ✅ Toda tipagem deve ficar nos arquivos Types
   - ❌ NUNCA colocar tipagens diretamente no Service
   - ❌ NUNCA colocar tipagens diretamente no Utils
   - ❌ NUNCA usar `any`
   - ✅ Sempre importar tipos de `types/`

5. **Um arquivo por diretório**
   - Cada arquivo deve ter seu próprio diretório
   - Exceção: types pode ter múltiplos arquivos relacionados

6. **Sistema de tema consistente**
   - Sempre aplicar o sistema de tema nos styled-components
   - Usar `useTheme` hook
   - Seguir padrão visual dos cards

7. **TypeScript estrito**
   - NUNCA usar `any`
   - Sempre tipificar explicitamente
   - NUNCA deixar props sem tipos

8. **Responsividade mobile-first**
   - Funcionalidades que funcionam no desktop devem funcionar identicamente no mobile
   - Sempre incluir breakpoints mobile

9. **Branches OBRIGATÓRIAS**
   - SEMPRE criar uma nova branch antes de qualquer alteração
   - NUNCA alterar código direto na main
   - Branch só deve ser encerrada após funcionalidade estar completa e aprovada

### Convenções de Nomenclatura

- **Arquivos:** PascalCase com sufixo (`PostCardComp.tsx`)
- **Componentes:** PascalCase (`PostCardComp`)
- **Hooks:** camelCase com prefixo `use` (`usePostCard`)
- **Services:** camelCase com sufixo `Service` (`postCardService`)
- **Utils:** camelCase com sufixo `Utils` (`PostCardUtils`)
- **Types:** PascalCase com sufixo `Types` (`PostCardTypes`)
- **Routes:** PascalCase com sufixo `Routes` (`PostCardRoutes`)
- **Styled-components:** camelCase com prefixo `Styled` (`StyledCard`)
- **Testes:** PascalCase com sufixo `.test` (`PostCard.test`)

---

## Tecnologias

### Core
- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript 5+
- **Runtime:** Node.js 18+

### UI
- **Styling:** Styled-components 6+
- **UI Components:** MUI (Material-UI)
- **Icons:** MUI Icons, Lucide React
- **Animations:** Framer Motion

### Estado e Dados
- **State Management:** TanStack Query 5+ (no Services)
- **Global State:** React Context
- **Forms:** React Hook Form

### Autenticação
- **JWT:** jsonwebtoken
- **Cookies:** js-cookie

### HTTP
- **Client:** Axios
- **Base URL:** Configurado em ambiente

### Tipos
- **TypeScript:** Strict mode
- **Validation:** Zod

### Testes
- **E2E:** Puppeteer (scripts Node)
- **Unit/Integration:** Vitest + Testing Library
- **Backend Real:** Sem mocks

### Outros
- **Internacionalização:** i18next
- **Date:** date-fns
- **Debounce:** lodash.debounce

---

## Fluxo de Comunicação

### Exemplo Completo: Post Card

```
1. COMPONENT (PostCardComp.tsx)
   - Renderiza o card
   - Recebe props do utils
   - Sem lógica de negócio

2. UTILS (PostCardUtils.tsx)
   - Gerencia variáveis e constantes
   - Gerencia estados (useState)
   - Objetos de configuração e mapeamentos
   - Lógica de negócio (funções)
   - Chama SERVICES

3. SERVICES (PostCardServices.tsx)
   - TanStack Query (useQuery, useMutation)
   - Requisições HTTP
   - Consome crudServices global
   - Transformação de dados
   - Retorna dados formatados

4. CRUDSERVICES (Global)
   - Funções genéricas de API
   - create, update, delete, etc.
   - Inclui URLs e IDs automaticamente
```

### Exemplo de Código

**PostCardComp.tsx (Component)**
```typescript
import { usePostCard } from '../utils/PostCardUtils';
import type { PostCardTypes } from '../types/PostCardTypes';

export default function PostCardComp({ postId }: PostCardTypes) {
  const { state, actions } = usePostCard(postId);

  return (
    <StyledCard>
      <StyledContent>{state.content}</StyledContent>
      <StyledButton onClick={actions.handleLike}>
        Curtir
      </StyledButton>
    </StyledCard>
  );
}
```

**PostCardUtils.tsx (Utils)**
```typescript
import { postCardService } from '../services/PostCardServices';
import { useState, useCallback } from 'react';
import type { PostCardTypes } from '../types/PostCardTypes';

// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const DEFAULT_CONTENT = '';

// ============================================
// 2️⃣ ESTADOS
// ============================================
export function usePostCard(postId: string) {
  const [liked, setLiked] = useState(false);

  // ============================================
  // 3️⃣ OBJETOS
  // ============================================
  const service = postCardService(postId);

  // ============================================
  // 4️⃣ FUNÇÕES
  // ============================================
  const handleLike = useCallback(() => {
    setLiked(true);
    service.likePost();
  }, [service]);

  return {
    state: { content: service.post?.content || DEFAULT_CONTENT, liked },
    actions: { handleLike },
  };
}
```

**PostCardServices.tsx (Services)**
```typescript
import { get, update } from '@/services/crudService';
import { useQuery, useMutation } from '@tanstack/react-query';

export function postCardService(postId: string) {
  const { data: post } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => get('posts', postId),
  });

  const likeMutation = useMutation({
    mutationFn: () => update('posts', postId, { liked: true }),
  });

  return {
    post,
    likePost: () => likeMutation.mutate(),
  };
}
```

**PostCardTypes.tsx (Types)**
```typescript
export interface PostCardTypes {
  postId: string;
  content?: string;
  liked?: boolean;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}
```

**PostCardStyles.tsx (Styles)**
```typescript
import styled from 'styled-components';

export const StyledCard = styled.div<{ theme: Theme }>`
  background: ${props => `linear-gradient(${props.theme.gradientDirection}, ${props.theme.primaryColor}, ${props.theme.secondaryColor})`};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
`;

export const StyledContent = styled.p`
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
`;

export const StyledButton = styled.button`
  background: ${props => props.theme.primaryColor};
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
`;
```

**PostCardRoutes.tsx (Routes)**
```typescript
export const postCardRoutes = {
  view: (postId: string) => `/post/${postId}`,
  edit: (postId: string) => `/post/${postId}/edit`,
  list: '/posts',
};
```

**PostCard.test.tsx (Test)**
```typescript
import { render, screen } from '@testing-library/react';
import PostCardComp from '../components/PostCardComp';

describe('PostCardComp', () => {
  it('should render post content', () => {
    render(<PostCardComp postId="123" />);
    expect(screen.getByTestId('post-content')).toBeInTheDocument();
  });
});
```

---

## Sistema de Tipos

### Estrutura de Tipos

```
types/
├── index.ts                    # Exporta todos os tipos
├── api.types.ts               # Tipos de requisições/respostas da API
├── components.types.ts        # Tipos de props dos componentes
├── models.types.ts            # Tipos de modelos de dados (User, Post, Comment, etc)
├── hooks.types.ts             # Tipos de hooks customizados
└── services.types.ts          # Tipos de serviços
```

### Exemplos de Tipos

**Props de Componentes**
```typescript
// types/components.types.ts
export interface PostCardProps {
  postId: string;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

// No componente:
import type { PostCardProps } from '../types/PostCardTypes';

export default function PostCardComp({ postId, onEdit, onDelete }: PostCardProps) {
  // ...
}
```

**Modelos de Dados**
```typescript
// types/models.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  likes: number;
}
```

**Respostas da API**
```typescript
// types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

**Hooks Customizados**
```typescript
// types/hooks.types.ts
export interface UseQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export interface UseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}
```

**Services**
```typescript
// types/services.types.ts
export interface ICommentService {
  getComments(contentId: string): Promise<Comment[]>;
  addComment(contentId: string, content: string): Promise<Comment>;
  deleteComment(commentId: string): Promise<void>;
  updateComment(commentId: string, content: string): Promise<Comment>;
}
```

### Boas Práticas de Tipagem

- ✅ Usar `interface` para objetos, `type` para unions/primitivos
- ✅ Exportar tipos do `index.ts` para facilitar imports
- ✅ Usar `type` imports quando possível: `import type { ... }`
- ✅ Manter tipos próximos ao seu uso (models, components, api)
- ✅ Documentar tipos complexos com comentários JSDoc
- ❌ NUNCA usar `any` - sempre tipificar explicitamente
- ❌ NUNCA deixar props sem tipos
- ❌ NUNCA colocar tipagens diretamente no Service ou no Utils

---

## Sistema de Tema

### Como Aplicar o Tema

```typescript
// 1. Importar useTheme
import { useTheme } from '@/context/theme/ThemeContext';

// 2. No component, passar theme para styled-component
const { theme } = useTheme();
<StyledComponent theme={theme}>
```

### No Styled-Component

```typescript
const StyledComponent = styled.div<{ theme: Theme }>`
  background: ${props => `linear-gradient(${props.theme.gradientDirection}, ${props.theme.primaryColor}, ${props.theme.secondaryColor})`};
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.textColor};
`;
```

### Padrão Visual dos Cards

- **Gradiente diagonal (45deg):** Azul escuro → Azul médio
- **Backdrop blur:** Glassmorphism
- **Bordas arredondadas:** 20px
- **Sombras profundas:** Para elevação
- **Transparências:** Para sobreposições
- **Transições suaves:** 0.3s

### Exemplo de Card com Tema

```typescript
const StyledCard = styled.div<{ theme: Theme }>`
  background: ${props => `linear-gradient(${props.theme.gradientDirection}, ${props.theme.primaryColor}, ${props.theme.secondaryColor})`};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: ${props => props.theme.boxShadow};
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.boxShadowHover};
  }
`;
```

---

## TanStack Query

### OBRIGATÓRIO no Services

TanStack Query é obrigatório para todas as requisições HTTP, cache e sincronização de dados, e **deve ser usado exclusivamente no Services Layer**, nunca no Utils.

### useQuery - Para Buscar Dados

```typescript
// ✅ CORRETO - No Services
export function postService(userId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => get('posts/user', userId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!userId, // Só executa se userId existir
  });

  return { data, isLoading, error, refetch };
}
```

### useMutation - Para Modificar Dados

```typescript
// ✅ CORRETO - No Services
export function createPostService() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreatePostDto) => create('posts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return mutation;
}
```

### useInfiniteQuery - Para Paginação Infinita

```typescript
// ✅ CORRETO - No Services
export function feedService() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: ({ pageParam = 0 }) => get('posts/feed', { page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  return { data, isLoading, fetchNextPage, hasNextPage };
}
```

### Invalidação de Cache

```typescript
// ✅ CORRETO - No Services
export function invalidatePostsService() {
  const queryClient = useQueryClient();

  return {
    invalidatePost: (postId: string) => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
    invalidateAllPosts: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    invalidateByPredicate: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'posts',
      });
    },
  };
}
```

---

## Componentes

### Responsabilidades por Camada

**COMPONENT (.tsx)**
- ✅ Apenas renderização e TSX
- ❌ SEM lógicas, estados, arrays, effects, estilos e estilos inline
- ✅ Consome apenas UTILS
- ✅ Importa tipos de TYPES

**UTILS (.tsx)**
- ✅ Organização: **variáveis → estados → objetos → funções**
- ✅ Variáveis e constantes
- ✅ Estados (useState, useReducer)
- ✅ Effects (useEffect, useLayoutEffect)
- ✅ Objetos, mapeamentos, JSON
- ✅ Lógica de negócio (funções)
- ✅ Hooks customizados
- ❌ NUNCA TanStack Query
- ❌ NUNCA tipagens diretas
- ✅ Consome apenas SERVICES

**SERVICES (.tsx)**
- ✅ TanStack Query (useQuery, useMutation, useInfiniteQuery)
- ✅ Requisições HTTP
- ✅ Consome crudServices global
- ✅ Transformação de dados da API
- ✅ Mocks
- ✅ Cache e invalidação
- ❌ NUNCA tipagens diretas

**STYLES (.tsx)**
- ✅ Styled-components
- ✅ Estilos e temas
- ✅ Animações e transições

**ROUTES (.tsx)**
- ✅ Definições de rotas
- ✅ Links de navegação
- ✅ Configuração de URLs

**TYPES (.tsx)**
- ✅ Interfaces e tipos
- ✅ Props de componentes
- ✅ Contratos de API

**TEST (.tsx)**
- ✅ Testes unitários
- ✅ Testes de integração
- ✅ Cenários de uso

### Exemplo de Componente Completo

**PostCardComp.tsx**
```typescript
import { usePostCard } from '../utils/PostCardUtils';
import { StyledCard, StyledContent, StyledButton } from '../styles/PostCardStyles';
import type { PostCardTypes } from '../types/PostCardTypes';

export default function PostCardComp({ postId, onEdit, onDelete }: PostCardTypes) {
  const { state, actions } = usePostCard(postId);

  return (
    <StyledCard theme={theme}>
      <StyledContent data-testid="post-content">{state.content}</StyledContent>
      <StyledButton data-testid="like-button" onClick={actions.handleLike}>
        {state.liked ? 'Curtido' : 'Curtir'}
      </StyledButton>
    </StyledCard>
  );
}
```

**PostCardUtils.tsx**
```typescript
import { useState, useCallback } from 'react';
import { postCardService } from '../services/PostCardServices';

// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const DEFAULT_CONTENT = '';
const LIKE_ACTION = 'like';
const UNLIKE_ACTION = 'unlike';

// ============================================
// 2️⃣ ESTADOS
// ============================================
export function usePostCard(postId: string) {
  const [liked, setLiked] = useState(false);

  // ============================================
  // 3️⃣ OBJETOS
  // ============================================
  const service = postCardService(postId);

  const state = {
    content: service.post?.content || DEFAULT_CONTENT,
    liked,
  };

  // ============================================
  // 4️⃣ FUNÇÕES
  // ============================================
  const handleLike = useCallback(() => {
    const action = liked ? UNLIKE_ACTION : LIKE_ACTION;
    setLiked(!liked);
    service.likePost(action);
  }, [liked, service]);

  return {
    state,
    actions: { handleLike },
  };
}
```

**PostCardServices.tsx**
```typescript
import { get, update } from '@/services/crudService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function postCardService(postId: string) {
  const queryClient = useQueryClient();

  const { data: post } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => get('posts', postId),
  });

  const likeMutation = useMutation({
    mutationFn: (action: string) => update('posts', postId, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  return {
    post,
    likePost: (action: string) => likeMutation.mutate(action),
  };
}
```

**PostCardStyles.tsx**
```typescript
import styled from 'styled-components';

export const StyledCard = styled.div<{ theme: Theme }>`
  background: ${props => `linear-gradient(${props.theme.gradientDirection}, ${props.theme.primaryColor}, ${props.theme.secondaryColor})`};
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
`;

export const StyledContent = styled.p`
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
`;

export const StyledButton = styled.button`
  background: ${props => props.theme.primaryColor};
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
`;
```

**PostCardTypes.tsx**
```typescript
export interface PostCardTypes {
  postId: string;
  content?: string;
  liked?: boolean;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export interface PostCardState {
  content: string;
  liked: boolean;
}

export interface PostCardActions {
  handleLike: () => void;
}
```

**PostCardRoutes.tsx**
```typescript
export const postCardRoutes = {
  view: (postId: string) => `/post/${postId}`,
  edit: (postId: string) => `/post/${postId}/edit`,
  list: '/posts',
};
```

**PostCard.test.tsx**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostCardComp from '../components/PostCardComp';

const queryClient = new QueryClient();

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('PostCardComp', () => {
  it('should render post content', () => {
    renderWithProviders(<PostCardComp postId="123" />);
    expect(screen.getByTestId('post-content')).toBeInTheDocument();
  });

  it('should call handleLike when button is clicked', () => {
    renderWithProviders(<PostCardComp postId="123" />);
    const button = screen.getByTestId('like-button');
    fireEvent.click(button);
    // Assert like action
  });
});
```

---

## Rotas

### Responsabilidades

O diretório `routes/` é responsável por centralizar todas as definições de rotas e navegação de cada componente/feature.

**Exemplo de Arquivo de Rotas:**

```typescript
// shared/post/card/routes/PostCardRoutes.tsx
export const postCardRoutes = {
  view: (postId: string) => `/post/${postId}`,
  edit: (postId: string) => `/post/${postId}/edit`,
  create: '/post/create',
  list: '/posts',
  userPosts: (userId: string) => `/user/${userId}/posts`,
};
```

**Uso no Componente:**

```typescript
import { postCardRoutes } from '../routes/PostCardRoutes';
import { useRouter } from 'next/navigation';

export function usePostCard(postId: string) {
  const router = useRouter();

  const navigateToPost = () => {
    router.push(postCardRoutes.view(postId));
  };

  return {
    actions: { navigateToPost },
  };
}
```

---

## Testes

### Estrutura de Testes

Cada diretório de componente deve conter sua própria pasta `test/` com os testes específicos daquele componente.

```
NomeDoDiretorio/
└── test/
    ├── NomeDoDiretorio.test.tsx        # Testes do componente
    ├── NomeDoDiretorioUtils.test.ts     # Testes do utils
    └── NomeDoDiretorioServices.test.ts  # Testes do services
```

### Testes E2E com Backend Real

**OBJETIVO:** Testar o fluxo completo de Stories (API + Interações) com backend real, sem mocks, via script Node.

**PADRÃO OFICIAL (scripts/):**
- `scripts/test-stories-interactions.js`

**CARACTERÍSTICAS DO TESTE:**
- Teste de integração:
  - Criação de story por um usuário (Neil)
  - Curtida por outro usuário (Hashirama)
  - Comentários e respostas
  - Verificação de persistência do like
- Autenticação:
  - Dois usuários de teste hardcoded
  - Login real via API antes de cada teste
- Estabilidade:
  - Testa endpoints diretamente sem UI (mais rápido)
  - Verifica userReaction após like (debug de persistência)

**COMO RODAR:**

```bash
node scripts/test-stories-interactions.js
```

Trocar URL da API (opcional):
```bash
$env:API_URL='http://localhost:3000'; node scripts/test-stories-interactions.js
```

**FLUXO DO TESTE:**
1. Neil faz login e cria um story de texto
2. Hashirama faz login e curte o story (tipo: love)
3. Verifica resumo de reações (inclui userReaction)
4. Hashirama comenta no story
5. Neil responde ao comentário
6. Hashirama remove a curtida
7. Verifica que userReaction é null após remover
8. Hashirama curte novamente (tipo: like)
9. Limpeza: deleta o story de teste

**USUÁRIOS DE TESTE:**
- Neil: neil.033@hotmail.com / madara2026
- Hashirama: hashiramasenju@hotmail.com / madara2026

### data-testid Obrigatório

Para testes E2E, todos os elementos interativos devem ter `data-testid`:

```typescript
<button data-testid="like-button" onClick={handleLike}>
  Curtir
</button>
```

### Testes Unitários com Vitest

```typescript
// shared/post/card/test/PostCardUtils.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostCard } from '../utils/PostCardUtils';

const queryClient = new QueryClient();

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('usePostCard', () => {
  it('should return default state', () => {
    const { result } = renderHook(
      () => usePostCard('123'),
      { wrapper: createWrapper() }
    );

    expect(result.current.state).toBeDefined();
    expect(result.current.actions).toBeDefined();
  });
});
```

---

## Deploy

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Variáveis de ambiente configuradas

### Variáveis de Ambiente

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3002

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Auth
NEXT_PUBLIC_JWT_SECRET=...

# Storage
NEXT_PUBLIC_STORAGE_URL=...
```

### Build de Produção

```bash
# Instalar dependências
npm install

# Build
npm run build

# Start
npm start
```

### Deploy com Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy com Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t nexus-social-frontend .

# Run container
docker run -p 3001:3000 nexus-social-frontend
```

---

## Boas Práticas

### 1. Organização do Utils (variáveis → estados → objetos → funções)

```typescript
// ✅ CORRETO - Organizado em camadas
// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const API_ENDPOINT = 'posts';
const DEFAULT_LIMIT = 10;

// ============================================
// 2️⃣ ESTADOS
// ============================================
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);

// ============================================
// 3️⃣ OBJETOS
// ============================================
const config = {
  endpoint: API_ENDPOINT,
  limit: DEFAULT_LIMIT,
};

// ============================================
// 4️⃣ FUNÇÕES
// ============================================
function handleLoadMore() {
  // lógica
}

// ❌ ERRADO - Bagunçado e sem ordem
const [items, setItems] = useState([]);
const API_ENDPOINT = 'posts';
function doSomething() { }
const config = { ... };
```

### 2. TanStack Query SOMENTE no Services

```typescript
// ❌ ERRADO - TanStack Query no Utils
export function usePostCard(postId: string) {
  const { data } = useQuery({ ... }); // ❌ Deveria estar no Services
  ...
}

// ✅ CORRETO - Utils chama Services
export function usePostCard(postId: string) {
  const service = postCardService(postId); // ✅ TanStack Query está no Services
  ...
}
```

### 3. Tipagens SOMENTE no Types

```typescript
// ❌ ERRADO - Tipagem direta no Service
export function postService(userId: string): Promise<{ id: string; name: string }> {
  // ...
}

// ❌ ERRADO - Tipagem direta no Utils
interface PostData { id: string; name: string; }

// ✅ CORRETO - Tipagem no Types
// types/PostCardTypes.ts
export interface PostData {
  id: string;
  name: string;
}

// services/PostCardServices.ts
import type { PostData } from '../types/PostCardTypes';
export function postService(userId: string): Promise<PostData> {
  // ...
}
```

### 4. Sempre usar TanStack Query

```typescript
// ❌ ERRADO - Fetch direto
const [posts, setPosts] = useState([]);
useEffect(() => {
  fetch('/api/posts').then(res => res.json()).then(setPosts);
}, []);

// ✅ CORRETO - TanStack Query no Services
export function postService() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => get('posts'),
  });
  return { posts };
}
```

### 5. Sempre tipar props

```typescript
// ❌ ERRADO - Props sem tipo
export default function PostCard({ postId, onEdit }) {
  // ...
}

// ✅ CORRETO - Props tipadas
import type { PostCardTypes } from '../types/PostCardTypes';

export default function PostCard({ postId, onEdit }: PostCardTypes) {
  // ...
}
```

### 6. Sempre usar styled-components

```typescript
// ❌ ERRADO - Estilos inline
<div style={{ background: 'blue', padding: '20px' }}>

// ✅ CORRETO - Styled-component
const StyledDiv = styled.div`
  background: blue;
  padding: 20px;
`;
```

### 7. Sempre aplicar tema

```typescript
// ❌ ERRADO - Sem tema
const StyledCard = styled.div`
  background: #000;
`;

// ✅ CORRETO - Com tema
const StyledCard = styled.div<{ theme: Theme }>`
  background: ${props => props.theme.primaryColor};
`;
```

### 8. Mobile-first

```typescript
// ✅ CORRETO - Mobile-first
const StyledContainer = styled.div`
  padding: 16px;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;
```

---

## Troubleshooting

### Problemas Comuns

#### 1. Erro de tipo "any"
```bash
# Verificar se todos os props estão tipados
# Usar import type para tipos
# Verificar se os tipos estão em types/ e não no service ou utils
```

#### 2. TanStack Query não atualizando
```bash
# Verificar se invalidQueries está sendo chamado no Services
# Verificar queryKey está correto
```

#### 3. Tema não aplicando
```bash
# Verificar se useTheme está sendo usado
# Verificar se theme está sendo passado para styled-component
```

#### 4. Build falhando
```bash
# Limpar cache
rm -rf .next
npm run build

# Verificar tipos
npx tsc --noEmit
```

---

## Suporte

Para dúvidas ou problemas:
- Documentação Next.js: https://nextjs.org/docs
- Documentação TanStack Query: https://tanstack.com/query/latest
- Documentação Styled-components: https://styled-components.com/docs

---

**Última atualização:** 2026
**Versão:** 2.0.0


Não quero funções lógicas, estados, variáveis, arrays, objetos, interfaces, nada diretamente no componente. E se porventura, quando você estiver editando, você encontrar alguma coisa dessas no componente, você retira. Outra, não quero estilos diretamente no componente. O componente tem que ser apenas a renderização pura. Ele só vai puxar das outras páginas, certo? Eu quero que você faça isso e também eu não quero ver interfaces nem tipagens diretamente no service e nem no útil. Eu quero tudo isso no type. O type é justamente para interface e para tipagens, certo? Você tem que ler as instruções e fazer exatamente conforme mostra ali. Você não pode aplicar e mesmo que você veja alguma coisa ali, você deve corrigir, certo? Consuma para ele para que ele liste. Ele puxe do banco de dados diretamente os dados que estão no banco e exiba nos cards, certo?
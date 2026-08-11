# 📋 Kanban - Jogo de Damas 🎲

> **Stack:** Next.js + Three.js (Frontend) | Nest.js + Prisma (Backend)

---

## 📌 A FAZER (To Do)

### 1. Configurar estrutura de diretórios do Frontend
**Descrição:** Criar a estrutura de pastas do frontend seguindo a arquitetura estrita definida: Component → Utils → Services → crudServices. Cada feature terá seu próprio diretório com `components/`, `utils/`, `services/`, `styles/`, `types/`, `routes/` e `test/`.

- Criar diretórios base: `src/api/`, `src/assets/`, `src/context/`, `src/hooks/`, `src/scripts/`, `src/services/`, `src/shared/`, `src/styles/`, `src/theme/`, `src/types/`, `src/utils/`
- Criar diretórios compartilhados: `src/shared/board/`, `src/shared/piece/`, `src/shared/game/`, `src/shared/menu/`, `src/shared/history/`
- Cada diretório compartilhado com subpastas: `components/`, `utils/`, `services/`, `styles/`, `types/`, `routes/`, `test/`
- Configurar `src/services/crudService.ts` (funções genéricas de API: get, create, update, delete)
- Configurar `src/api/` com URLs da API
- Remover Tailwind CSS e instalar Styled-components (conforme regras)

### 2. Configurar estrutura de diretórios do Backend
**Descrição:** Criar a estrutura modular do backend seguindo o mapa de estrutura definido, com `core/`, `config/`, `auth/`, `modules/`, `providers/` e `common/`.

- Criar `src/core/prisma/` (PrismaService/Module único)
- Criar `src/core/base/` (classes base)
- Criar `src/config/` (database.config.ts, jwt.config.ts, cors.config.ts)
- Criar `src/auth/controllers/`, `src/auth/services/`, `src/auth/repository/`, `src/auth/dto/`, `src/auth/strategies/`, `src/auth/guards/`
- Criar `src/modules/game/controllers/`, `src/modules/game/services/`, `src/modules/game/repository/`, `src/modules/game/dto/`, `src/modules/game/schemas/`, `src/modules/game/interface/`, `src/modules/game/types/`, `src/modules/game/logs/`, `src/modules/game/routes/`
- Criar `src/common/` (decorators, filters, guards, interceptors globais)
- Configurar `src/app.module.ts` importando CoreModule, AuthModule, GameModule

### 3. Configurar Three.js no Frontend
**Descrição:** Instalar e configurar `@react-three/fiber`, `@react-three/drei` e `three` no Next.js para renderização 3D do tabuleiro.

- Instalar pacotes: `npm install three @react-three/fiber @react-three/drei`
- Instalar tipos: `npm install -D @types/three`
- Configurar canvas no layout principal (`src/app/`)
- Criar `src/shared/board/components/Board3DComp.tsx` (apenas renderização)
- Criar `src/shared/board/utils/Board3DUtils.tsx` (configuração da cena, câmera, iluminação)
- Criar `src/shared/board/services/Board3DServices.tsx` (carregar assets 3D)
- Criar `src/shared/board/types/Board3DTypes.tsx` (tipos BoardProps, CellPosition, etc.)
- Criar `src/shared/board/styles/Board3DStyles.tsx` (Styled-components)
- Criar `src/shared/board/routes/Board3DRoutes.tsx`

### 4. Modelar peças do jogo em 3D
**Descrição:** Criar componentes 3D para as peças (brancas, pretas e dama/rei) com geometria cilíndrica e destaque visual.

- Criar `src/shared/piece/components/Piece3DComp.tsx`
- Criar `src/shared/piece/utils/Piece3DUtils.tsx` (configuração de geometria, cores, texturas)
- Criar `src/shared/piece/services/Piece3DServices.tsx` (animações de hover/seleção)
- Criar `src/shared/piece/types/Piece3DTypes.tsx` (PieceType, PieceColor, PieceState)
- Criar `src/shared/piece/styles/Piece3DStyles.tsx`
- Versão "dama" com anel/coroa dourada no topo

### 5. Implementar lógica de movimentação das peças (Frontend)
**Descrição:** Implementar a lógica de validação de movimentos no utils do frontend, seguindo as regras de dama: diagonal para frente, captura obrigatória, captura múltipla, movimento para trás da dama.

- Criar `src/shared/game/utils/GameRulesUtils.tsx` com organização: variáveis → estados → objetos → funções
- Implementar funções: `getValidMoves`, `isCaptureMove`, `isKingPromotion`, `getCaptureSequence`
- Criar `src/shared/game/types/GameTypes.tsx` (GameState, Move, Position, Piece, Board)
- Criar `src/shared/game/components/GameBoardComp.tsx` (componente principal do tabuleiro)
- Criar `src/shared/game/styles/GameBoardStyles.tsx`
- Criar `src/shared/game/routes/GameRoutes.tsx`

### 6. Implementar game loop no Backend (Nest.js)
**Descrição:** Criar módulo `GameModule` completo com controller, service, repository e schemas. Toda regra de validação de movimento deve ficar no backend.

- Criar `src/modules/game/game.module.ts`
- Criar `src/modules/game/controllers/GameController.ts` (endpoints: POST /move, GET /valid-moves, POST /start-game)
- Criar `src/modules/game/services/GameService.ts` (validação de movimentos, captura, promoção)
- Criar `src/modules/game/repository/GameRepository.ts` (persistência de partidas e movimentos)
- Criar `src/modules/game/dto/MoveDto.ts`, `StartGameDto.ts`
- Criar `src/modules/game/schemas/GameSchema.ts`
- Criar `src/modules/game/interface/IGameService.ts`
- Criar `src/modules/game/types/GameTypes.ts`
- Criar `src/modules/game/logs/GameLogs.ts`
- Criar `src/modules/game/routes/GameRoutes.ts`

### 7. Configurar Prisma + Banco de Dados
**Descrição:** Instalar Prisma, configurar schema com os modelos necessários e executar migrações iniciais.

- Instalar Prisma: `npm install @prisma/client && npm install -D prisma`
- Configurar `prisma/schema.prisma` com modelos:
  - `User` (id, name, email, password, createdAt)
  - `Game` (id, player1Id, player2Id, status, winnerId, createdAt, updatedAt)
  - `Move` (id, gameId, playerId, fromRow, fromCol, toRow, toCol, capturedPiece, isKingPromotion, createdAt)
  - `PlayerGameStats` (id, userId, wins, losses, draws, rating)
- Criar `src/core/prisma/PrismaService.ts` (serviço único, conforme regra)
- Criar `src/core/prisma/PrismaModule.ts`
- Executar `npx prisma migrate dev`

### 8. Criar sistema de autenticação (Backend)
**Descrição:** Implementar autenticação completa com JWT no módulo `auth/`, conforme estrutura definida.

- Criar `src/auth/auth.module.ts`
- Criar `src/auth/controllers/AuthController.ts` (POST /auth/register, POST /auth/login)
- Criar `src/auth/services/AuthService.ts` (hash de senha, geração de JWT)
- Criar `src/auth/repository/AuthRepository.ts` (busca/criação de usuários)
- Criar `src/auth/dto/RegisterDto.ts`, `LoginDto.ts`
- Criar `src/auth/strategies/JwtStrategy.ts`
- Criar `src/auth/guards/JwtAuthGuard.ts`
- Configurar `src/config/jwt.config.ts`, `src/config/auth.config.ts`
- Criar `src/common/decorators/CurrentUser.ts`

### 9. Criar sistema de turnos e estado do jogo (Frontend)
**Descrição:** Implementar o controle de turnos no frontend com indicador visual, bloqueio de interação e sincronização com o backend.

- Criar hooks globais em `src/hooks/useGameState.ts`
- Criar `src/shared/game/utils/GameTurnUtils.tsx` (alternância de turnos, validação de vez)
- Atualizar `src/shared/board/components/Board3DComp.tsx` para receber estado do jogo
- Implementar indicador visual de turno no `src/shared/game/styles/GameBoardStyles.tsx`
- Bloquear interação durante animação ou turno do oponente

### 10. Criar tela de menu inicial
**Descrição:** Criar a página inicial com opções de "Jogar vs IA", "Jogar Online" e "Histórico", seguindo padrão visual de cards com gradiente e glassmorphism.

- Criar `src/shared/menu/components/MenuComp.tsx`
- Criar `src/shared/menu/utils/MenuUtils.tsx` (navegação, estados dos botões)
- Criar `src/shared/menu/services/MenuServices.tsx` (buscar salas disponíveis, status do servidor)
- Criar `src/shared/menu/types/MenuTypes.tsx`
- Criar `src/shared/menu/styles/MenuStyles.tsx` (cards com gradiente 45deg, glassmorphism, sombras)
- Criar `src/shared/menu/routes/MenuRoutes.tsx`
- Criar `src/shared/menu/test/MenuComp.test.tsx`
- Input para criar/entrar em sala multiplayer

### 11. Criar tela de histórico de partidas
**Descrição:** Listar partidas anteriores do usuário com resultado, data e oponente. Permitir replay dos movimentos.

- Criar `src/shared/history/components/HistoryComp.tsx`
- Criar `src/shared/history/utils/HistoryUtils.tsx` (formatação de dados, filtros)
- Criar `src/shared/history/services/HistoryServices.tsx` (useQuery para listar partidas)
- Criar `src/shared/history/types/HistoryTypes.tsx`
- Criar `src/shared/history/styles/HistoryStyles.tsx`
- Criar `src/shared/history/routes/HistoryRoutes.tsx`
- Criar `src/shared/history/test/HistoryComp.test.tsx`

### 12. Implementar promoção a dama (rei)
**Descrição:** Detectar automaticamente quando uma peça chega à última fileira adversária, substituir por dama e animar a transição.

- Atualizar `src/shared/game/utils/GameRulesUtils.tsx` com lógica de promoção
- Atualizar `src/modules/game/services/GameService.ts` com validação de promoção
- Atualizar `src/shared/piece/utils/Piece3DUtils.tsx` com transição de peça comum → dama
- Criar animação de "brilho" na peça ao ser promovida

### 13. Implementar WebSockets para multiplayer
**Descrição:** Configurar WebSocket Gateway no Nest.js com Socket.io para sincronização de jogadas em tempo real entre dois jogadores.

- Instalar `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io-client`
- Criar `src/modules/game/gateway/GameGateway.ts` (eventos: joinRoom, makeMove, gameOver)
- Criar salas de jogo (game rooms) para cada partida
- Atualizar frontend com `src/hooks/useWebSocket.ts`
- Sincronizar movimentos entre jogadores em tempo real
- Tratar desconexão e reconexão

### 14. Implementar modo IA (Computador)
**Descrição:** Criar algoritmo de IA com Minimax e poda alfa-beta para jogar contra o computador em diferentes níveis de dificuldade.

- Criar `src/modules/game/services/AIService.ts` (algoritmo Minimax)
- Implementar poda alfa-beta para otimização
- Criar níveis de dificuldade: Fácil (profundidade 2), Médio (profundidade 4), Difícil (profundidade 6)
- Criar endpoint POST /game/ai-move no `GameController.ts`
- Integrar IA como opponent automático no frontend

### 15. Adicionar animações nas jogadas
**Descrição:** Animar movimentação das peças, capturas e promoções com transições suaves usando Framer Motion e animações Three.js.

- Instalar Framer Motion: `npm install framer-motion`
- Animar deslizamento das peças entre células
- Animar captura (peça "sumindo" com fade/scale out)
- Animar promoção a dama com efeito de brilho/girar
- Adicionar feedback visual de seleção da peça (highlight)
- Adicionar transições de 0.3s com easing suave

### 16. Implementar som e efeitos sonoros
**Descrição:** Adicionar sons para interações do jogo: mover peça, capturar, vitória, derrota.

- Criar `src/shared/game/services/GameSoundService.tsx` (gerenciamento de áudio)
- Adicionar som ao mover peça
- Adicionar som ao capturar peça adversária
- Adicionar som de promoção a dama
- Adicionar som de vitória/derrota
- Configurar toggle de som no menu de opções
- Criar `src/shared/game/types/GameSoundTypes.tsx`

### 17. Criar sistema de matchmaking
**Descrição:** Implementar fila de espera para jogadores online com emparelhamento automático.

- Criar `src/modules/game/services/MatchmakingService.ts`
- Criar fila de espera em memória
- Emparelhamento automático baseado em nível/rating
- Notificar ambos jogadores quando oponente encontrado (via WebSocket)
- Criar `src/modules/game/dto/MatchmakingDto.ts`
- Atualizar tela de menu com status da fila de espera

---

## 🔄 EM ANDAMENTO (In Progress)

*(Nenhuma tarefa em andamento no momento)*

---

## ✅ CONCLUÍDO (Done)

- [x] **Criar projeto Next.js com TypeScript** — `./frontend` criado com Next.js 16
- [x] **Criar projeto Nest.js com TypeScript** — `./backend` criado no modo strict
- [x] **Criar arquivos de instruções** — `frontend/instrucoes.txt`, `backend/src/instrucoes.txt`, `backend/src/mapa_estrutura.txt`

---

## 🏗️ Arquitetura do Projeto

### Frontend — Arquitetura Estrita

```
frontend/src/
├── api/                        # URLs da API
├── app/                        # App Router (Next.js)
├── assets/                     # Arquivos estáticos
├── components/                 # Componentes globais
├── context/                    # Contextos (Theme, Auth)
├── hooks/                      # Hooks globais
├── scripts/                    # Scripts de automação
├── services/                   # crudService global
├── shared/                     # Features compartilhadas
│   ├── board/                  # Tabuleiro 3D
│   │   ├── components/         # Board3DComp (renderização pura)
│   │   ├── utils/              # Board3DUtils (estados, lógica)
│   │   ├── services/           # Board3DServices (TanStack Query)
│   │   ├── styles/             # Board3DStyles (styled-components)
│   │   ├── types/              # Board3DTypes (interfaces)
│   │   ├── routes/             # Board3DRoutes (navegação)
│   │   └── test/               # Board3D.test (testes)
│   ├── piece/                  # Peças 3D
│   ├── game/                   # Lógica do jogo
│   ├── menu/                   # Menu inicial
│   └── history/                # Histórico de partidas
├── styles/                     # Estilos globais
├── theme/                      # Configuração de tema
├── types/                      # Tipos globais
└── utils/                      # Utilitários globais
```

**Fluxo de comunicação:** `Component → Utils → Services → crudService (API)`

### Backend — Arquitetura Modular

```
backend/src/
├── auth/                       # Autenticação (Login/Registro/JWT)
│   ├── controllers/
│   ├── services/
│   ├── repository/
│   ├── dto/
│   ├── strategies/
│   └── guards/
├── common/                     # Infraestrutura global
├── config/                     # Configurações centralizadas
├── core/                       # Base reutilizável
│   ├── prisma/                 # PrismaService/Module (único)
│   └── base/                   # Classes base
├── modules/                    # Regras de negócio
│   ├── game/                   # Módulo do jogo de damas
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repository/
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── interface/
│   │   ├── types/
│   │   ├── logs/
│   │   └── routes/
│   └── user/                   # Gestão de usuários
├── providers/                  # Serviços externos
└── app.module.ts               # Módulo raiz
```

**Regras do Backend:**
1. **Prisma único:** Apenas `src/core/prisma` exporta PrismaService
2. **Config centralizada:** Todas as configs em `src/config/`
3. **Auth centralizado:** Módulo `src/auth/` é o único responsável por autenticação
4. **Core global:** CoreModule exporta Prisma e Storage para todo o app
5. **Tudo depende do core:** Nada pode ser implementado sem o CoreModule
6. **User conectado a todos:** Módulo user deve estar conectado a todos os outros módulos

---

## 📐 Padrões e Regras

### Frontend — Regras de Implementação
- ❌ NUNCA colocar lógica, estados, variáveis, arrays, objetos, interfaces no componente
- ✅ Componente = apenas renderização pura (TSX)
- ✅ Utils organizado em: **1. Variáveis → 2. Estados → 3. Objetos → 4. Funções**
- ✅ TanStack Query SOMENTE no Services Layer
- ✅ Tipagens SOMENTE no Types Layer
- ✅ Styled-components para estilização (nunca inline)
- ✅ Tema aplicado em todos os styled-components
- ✅ Mobile-first responsivo
- ✅ Sempre criar branch antes de alterar, nunca na main

### Backend — Regras de Implementação
- ✅ Nenhuma funcionalidade sem passar pelo Core
- ✅ Um arquivo por diretório (sem múltiplos arquivos na mesma pasta)
- ✅ Estrutura de módulos: controllers/, schemas/, dto/, interface/, repository/, services/, types/, logs/, routes/
- ✅ Antes de implementar, verificar se já existe para evitar duplicações
- ⚠️ NUNCA executar `prisma migrate reset` em produção
- ⚠️ Conexões "idle in transaction" seguram locks — usar `scripts/kill-locks.js`
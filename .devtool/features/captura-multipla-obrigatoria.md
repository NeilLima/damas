---
id: "captura-multipla-obrigatoria"
status: "backlog"
priority: "medium"
assignee: "victor"
epic: "gameplay-solo"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-11T22:05:00.000Z"
completedAt: null
labels: [frontend]
order: "a90"
---
# Lógica avançada: captura múltipla e obrigatória

## Descrição
A lógica em `BoardServices.tsx` cobre captura simples. Falta a captura **múltipla em cadeia** e a regra de **captura obrigatória**.

## A fazer
- Implementar `getCaptureSequence` (capturas em cadeia)
- Implementar captura obrigatória (se há captura, deve capturar)
- Mover impedindo tapetes incorretos; dama anda para trás
- Mover lógica definitiva para `src/shared/game/` (hoje está em `board/`)

## Critério de aceite
O jogo segue as regras oficiais de dama (captura obrigatória e múltipla corretas).
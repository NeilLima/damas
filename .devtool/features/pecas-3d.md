---
id: "pecas-3d"
status: "backlog"
priority: "medium"
assignee: "victor"
epic: "gameplay-solo"
dueDate: null
created: "2026-08-11T22:05:00.000Z"
modified: "2026-08-11T22:05:00.000Z"
completedAt: null
labels: [frontend, threejs]
order: "a80"
---
# Modelar peças em 3D (shared/piece)

## Descrição
`src/shared/piece/` está vazia. Criar componentes 3D para as peças (brancas, pretas e dama/rei).

## A fazer
- `components/Piece3DComp.tsx`
- `utils/Piece3DUtils.tsx`, `services/Piece3DServices.tsx`, `types/Piece3DTypes.tsx`, `styles/Piece3DStyles.tsx`
- Versão "dama/rei" com anel/coroa dourada no topo

## Critério de aceite
Peças renderizadas em 3D com destaque visual e variação dama/rei.
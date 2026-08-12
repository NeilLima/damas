// ============================================
// IA do Computador (Damas Automáticas)
// Feature IA Computador (Damas Automáticas)
// ============================================
'use client';

import type { BoardCell, BoardPosition, CellValue } from '../../board/types/BoardTypes';
import type { AIMove, AIDifficulty, PlayerColor } from '../types/GameTypes';

// ============================================
// 1️⃣ VARIÁVEIS
// ============================================
const DIFFICULTY_DEPTH: Record<AIDifficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 6,
};

const PIECE_WEIGHT = 100;
const KING_WEIGHT = 300;

// ============================================
// 2️⃣ HELPERS PUROS (espelham BoardServices)
// ============================================
function getPieceColor(value: CellValue): PlayerColor | null {
  if (value === 'white' || value === 'white-king') return 'white';
  if (value === 'black' || value === 'black-king') return 'black';
  return null;
}

function isKing(value: CellValue): boolean {
  return value === 'white-king' || value === 'black-king';
}

export function cloneBoard(cells: BoardCell[][]): BoardCell[][] {
  return cells.map((row) => row.map((cell) => ({ ...cell })));
}
/**
 * Gera os movimentos válidos para uma peça numa posição.
 * Considera movimentos simples + capturas de salto (sem sequência
 * múltipla dentro do mesmo turno — mantém consistência com movePiece).
 */
export function getValidMoves(
  cells: BoardCell[][],
  position: BoardPosition,
  pieceColor: PlayerColor,
): BoardPosition[] {
  const { row, col } = position;
  const moves: BoardPosition[] = [];
  const piece = cells[row][col].value;
  if (!piece) return moves;

  const kingPiece = isKing(piece);

  // Direção de avanço das peças normais: branco sobe (row -1), preto desce (row +1)
  const forwardDirs = pieceColor === 'white' ? [-1] : [1];
  const allRowDirs = [-1, 1];

  // Toda captura (frente ou trás) é permitida para peças normais e damas.
  // A dama também desliza e captura em todas as diagonais.
  if (kingPiece) {
    // DAMA: desliza em todas as diagonais, capturando peça no caminho
    for (const dRow of allRowDirs) {
      for (const dCol of [-1, 1]) {
        let r = row + dRow;
        let c = col + dCol;
        let crossedEnemy = false;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const targetCell = cells[r][c];
          if (!targetCell.isPlayable) break;
          const targetColor = getPieceColor(targetCell.value);

          if (targetColor === null) {
            moves.push({ row: r, col: c });
            if (crossedEnemy) break; // dama aterrissa logo após a peça capturada
          } else if (targetColor === pieceColor) {
            break; // peça própria bloqueia
          } else {
            if (crossedEnemy) break; // não pula duas peças seguidas
            crossedEnemy = true;
          }

          r += dRow;
          c += dCol;
        }
      }
    }
  } else {
    // PEÇA NORMAL
    // (a) Capturas: permitidas em TODAS as diagonais (frente e trás)
    for (const dRow of allRowDirs) {
      for (const dCol of [-1, 1]) {
        const mr = row + dRow;
        const mc = col + dCol;
        if (mr < 0 || mr >= 8 || mc < 0 || mc >= 8) continue;

        const mid = cells[mr][mc];
        const midColor = getPieceColor(mid.value);
        if (midColor && midColor !== pieceColor) {
          const lr = row + dRow * 2;
          const lc = col + dCol * 2;
          if (lr >= 0 && lr < 8 && lc >= 0 && lc < 8) {
            const land = cells[lr][lc];
            if (land.value === null && land.isPlayable) {
              moves.push({ row: lr, col: lc });
            }
          }
        }
      }
    }

    // (b) Movimento simples: somente 1 casa PARA FRENTE
    for (const dCol of [-1, 1]) {
      const fr = row + forwardDirs[0];
      const fc = col + dCol;
      if (fr >= 0 && fr < 8 && fc >= 0 && fc < 8) {
        const target = cells[fr][fc];
        if (target.value === null && target.isPlayable) {
          moves.push({ row: fr, col: fc });
        }
      }
    }
  }

  return moves;
}

/**
 * Aplica um movimento (uma peça move, capturando peça(s) no caminho).
 * Promove automaticamente a dama (rainha) na fileira final.
 */
export function movePiece(
  cells: BoardCell[][],
  from: BoardPosition,
  to: BoardPosition,
): BoardCell[][] {
  const newCells = cloneBoard(cells);
  const piece = newCells[from.row][from.col].value;

  // Remove peça(s) capturada(s) no caminho (dama desliza várias casas)
  const rowDir = Math.sign(to.row - from.row);
  const colDir = Math.sign(to.col - from.col);
  let r = from.row + rowDir;
  let c = from.col + colDir;
  while (r !== to.row || c !== to.col) {
    const mid = newCells[r][c];
    if (mid.value !== null) {
      newCells[r][c] = { ...mid, value: null };
    }
    r += rowDir;
    c += colDir;
  }

  // Promoção para dama
  let newValue: CellValue = piece;
  if (piece === 'white' && to.row === 0) newValue = 'white-king';
  if (piece === 'black' && to.row === 7) newValue = 'black-king';

  newCells[to.row][to.col] = {
    ...newCells[to.row][to.col],
    value: newValue,
  };
  newCells[from.row][from.col] = {
    ...newCells[from.row][from.col],
    value: null,
  };

  return newCells;
}
// ============================================
// 3️⃣ AVALIAÇÃO POSITIONAL
// ============================================
/**
 * Avalia o tabuleiro de perspectiva da `aiColor`.
 * Critérios: material (peão vs dama) + centralização. Valor positivo
 * favorece a IA, negativo o oponente.
 */
export function evaluate(cells: BoardCell[][], aiColor: PlayerColor): number {
  const aiKing = aiColor === 'white' ? 'white-king' : 'black-king';
  const aiPawn = aiColor === 'white' ? 'white' : 'black';
  const oppKing = aiColor === 'white' ? 'black-king' : 'white-king';
  const oppPawn = aiColor === 'white' ? 'black' : 'white';

  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const v = cells[row][col].value;
      let base = 0;
      if (v === aiPawn) base = PIECE_WEIGHT;
      else if (v === aiKing) base = KING_WEIGHT;
      else if (v === oppPawn) base = -PIECE_WEIGHT;
      else if (v === oppKing) base = -KING_WEIGHT;

      if (base !== 0) {
        // Pequeno bônus de centralização para peões/damas posicionados
        const centerBonus = (3 - Math.max(Math.abs(row - 3.5), Math.abs(col - 3.5))) * 4;
        score += base + (base > 0 ? centerBonus : -centerBonus);
      }
    }
  }
  return score;
}

// ============================================
// 4️⃣ ENUMERAÇÃO DE MOVIMENTOS
// ============================================
interface MoveCandidate {
  from: BoardPosition;
  to: BoardPosition;
  isCapture: boolean;
}

function hasEnemyInPath(
  cells: BoardCell[][],
  from: BoardPosition,
  to: BoardPosition,
  color: PlayerColor,
): boolean {
  const rowDir = Math.sign(to.row - from.row);
  const colDir = Math.sign(to.col - from.col);
  let r = from.row + rowDir;
  let c = from.col + colDir;
  while (r !== to.row || c !== to.col) {
    const mid = cells[r][c];
    const midColor = getPieceColor(mid.value);
    if (midColor !== null && midColor !== color) return true;
    r += rowDir;
    c += colDir;
  }
  return false;
}

function getAllMoves(cells: BoardCell[][], color: PlayerColor): MoveCandidate[] {
  const moves: MoveCandidate[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = cells[row][col].value;
      if (piece && getPieceColor(piece) === color) {
        const targets = getValidMoves(cells, { row, col }, color);
        for (const to of targets) {
          moves.push({
            from: { row, col },
            to,
            isCapture: hasEnemyInPath(cells, { row, col }, to, color),
          });
        }
      }
    }
  }

  // Capturas têm prioridade (regra das damas)
  const captures = moves.filter((m) => m.isCapture);
  return captures.length > 0 ? captures : moves;
}
// ============================================
// 5️⃣ MINIMAX + PODA ALFA-BETA
// ============================================
/**
 * Profundidade: fácil=2, médio=4, difícil=6.
 * maximize = true → turno da IA; false → turno do adversário.
 */
function minimax(
  cells: BoardCell[][],
  depth: number,
  alpha: number,
  beta: number,
  maximize: boolean,
  aiColor: PlayerColor,
  color: PlayerColor,
): number {
  const moves = getAllMoves(cells, color);
  if (depth === 0 || moves.length === 0) return evaluate(cells, aiColor);

  const nextColor: PlayerColor = color === 'white' ? 'black' : 'white';

  if (maximize) {
    let value = -Infinity;
    for (const m of moves) {
      const next = movePiece(cells, m.from, m.to);
      value = Math.max(
        value,
        minimax(next, depth - 1, alpha, beta, false, aiColor, nextColor),
      );
      alpha = Math.max(alpha, value);
      if (beta <= alpha) break; // poda beta
    }
    return value;
  }

  let value = Infinity;
  for (const m of moves) {
    const next = movePiece(cells, m.from, m.to);
    value = Math.min(
      value,
      minimax(next, depth - 1, alpha, beta, true, aiColor, nextColor),
    );
    beta = Math.min(beta, value);
    if (beta <= alpha) break; // poda alfa
  }
  return value;
}

// ============================================
// 6️⃣ API PÚBLICA
// ============================================
/**
 * Escolhe o melhor movimento para a IA.
 * @returns AIMove ou `null` quando não há movimentos válidos (derrota/empate).
 */
export function chooseAIMove(
  cells: BoardCell[][],
  aiColor: PlayerColor,
  difficulty: AIDifficulty,
): AIMove | null {
  const depth = DIFFICULTY_DEPTH[difficulty];
  const moves = getAllMoves(cells, aiColor);
  if (moves.length === 0) return null;

  const nextColor: PlayerColor = aiColor === 'white' ? 'black' : 'white';

  let bestMove: MoveCandidate | null = null;
  let bestValue = -Infinity;

  for (const m of moves) {
    const next = movePiece(cells, m.from, m.to);
    // Depois do movimento da IA, é o adversário que joga → minimize
    const value = minimax(next, depth - 1, -Infinity, Infinity, false, aiColor, nextColor);

    if (value > bestValue) {
      bestValue = value;
      bestMove = m;
    }
  }

  return bestMove
    ? { from: bestMove.from, to: bestMove.to }
    : null;
}
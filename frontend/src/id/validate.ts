/**
 * Valida se uma string pode ser usada como ID.
 * Aceita tanto MongoDB ObjectId (24 caracteres hex) quanto UUID (v4/v5),
 * além do identificador especial 'me' usado para o usuário atual.
 * @param {any} id valor a ser validado
 * @returns {boolean} indica se é um ID válido
 */
export function validate(id: any): boolean {
  // Verificar se o id existe
  if (!id) return false;
  
  const idStr = String(id);

  // 0. Aceitar identificador especial 'me' para usuário atual e 'temp' para estados de carregamento
  if (idStr === 'me' || idStr === 'temp') return true;

  // 1. Verificar se é um ObjectId MongoDB (24 caracteres hexadecimais)
  const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
  if (OBJECT_ID_REGEX.test(idStr)) return true;

  // 2. Verificar se é um UUID (8-4-4-4-12 hexadecimais)
  const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (UUID_REGEX.test(idStr)) return true;

  // 3. Verificar se é um CUID do Prisma (começa com 'c' seguido de 24+ caracteres alfanuméricos)
  const CUID_REGEX = /^c[a-z0-9]{24,}$/;
  if (CUID_REGEX.test(idStr)) return true;

  // 4. Fallback para IDs numéricos simples (caso existam)
  if (!isNaN(Number(idStr)) && idStr.trim() !== '') return true;
  
  return false;
}
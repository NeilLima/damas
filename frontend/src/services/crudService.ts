/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from '@/api/api';
import { validate } from '@/id/validate';
import { format } from '@/id/format';

const shouldDebugLog = process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true';

export { validate, format };

type NextAuthSession = {
  user?: {
    id?: string | number;
    userId?: string | number;
    accessToken?: string;
  };
};

type JwtPayload = {
  sub?: string | number;
  id?: string | number;
  userId?: string | number;
};

export type CrudQueryParams = Record<string, unknown>;

export type BulkUpdateItem = {
  id: string;
  data: Record<string, unknown>;
};

export type CustomRequestConfig = Record<string, unknown>;

export type GetImageSrcOptions = {
  fallbackImage?: string;
};

export function ensureUserId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const nextAuthSession = localStorage.getItem('nextauth.session');
    if (nextAuthSession) {
      const session = JSON.parse(nextAuthSession) as NextAuthSession;
      const idFromSession = session?.user?.id;
      if (idFromSession && idFromSession !== 'undefined' && idFromSession !== 'null') return String(idFromSession);
    }
  } catch (e) {
    console.error('[crudService] Erro ao parsear nextauth.session:', e);
  }

  try {
    const token = localStorage.getItem('token');
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1])) as JwtPayload;
        const idFromToken = payload.sub || payload.id || payload.userId;
        if (idFromToken) return String(idFromToken);
      }
    }
  } catch (e) {
    console.error('[crudService] Erro ao decodificar token:', e);
  }

  try {
    const userId = localStorage.getItem('userId');
    if (userId && userId !== 'undefined' && userId !== 'null') return String(userId);
  } catch (e) {
    console.error('[crudService] Erro ao ler userId do localStorage:', e);
  }

  return null;
}

export function isCurrentUserOwner(resourceId: string): boolean {
  if (!resourceId) return false;
  const userId = ensureUserId();
  if (!userId) return false;
  return String(userId) === String(resourceId);
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  return !!ensureUserId() && !!getAuthToken();
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function list(resource: string, params?: CrudQueryParams): Promise<any> {
  return api.get(`/${resource}`, { params }).then((res: any) => res.data);
}

export function getById(resource: string, id: string): Promise<any> {
  if (id === 'temp') return Promise.resolve(null);
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  return api.get(`/${resource}/${formattedId}`).then((res: any) => res.data)
    .catch((error: unknown) => {
      console.error(`Erro ao buscar ${resource} com ID ${formattedId}:`, error);
      throw error;
    });
}

export function listTyped<T = unknown>(resource: string, params?: CrudQueryParams): Promise<T> {
  return list(resource, params) as Promise<T>;
}

export function getByIdTyped<T = unknown>(resource: string, id: string): Promise<T> {
  return getById(resource, id) as Promise<T>;
}

export function create<T = unknown>(resource: string, data: Record<string, unknown> | FormData): Promise<T> {
  if (data instanceof FormData) {
    return api.post(`/${resource}`, data, {
      headers: { 'Content-Type': undefined }
    }).then((res: any) => res.data as T);
  } else {
    return api.post(`/${resource}`, data).then((res: any) => res.data as T);
  }
}

export function patchAction<T = unknown>(
  resource: string,
  id: string,
  action: string,
  data: Record<string, unknown>,
): Promise<T> {
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  const endpoint = `/${resource}/${formattedId}/${action}`;
  return api.patch(endpoint, data).then((res: any) => res.data as T);
}

export function update<T = unknown>(resource: string, id: string, data: Record<string, unknown>): Promise<T> {
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  return api.patch(`/${resource}/${formattedId}`, data).then((res: any) => res.data as T);
}

export function remove<T = unknown>(resource: string, id?: string, body?: object): Promise<T> {
  let url = `/${resource}`;
  if (id) {
    if (!validate(id)) throw new Error(`ID inválido: ${id}`);
    const formattedId = format(id);
    url += `/${formattedId}`;
  }
  return api.delete(url, { data: body }).then((res: any) => res.data as T);
}

export function count(resource: string, params?: CrudQueryParams): Promise<number> {
  return api.get(`/${resource}/count`, { params }).then((res: any) => res.data as number);
}

export function search<T = unknown>(resource: string, query: string, params?: CrudQueryParams): Promise<T> {
  return api.get(`/${resource}/search`, { params: { q: query, ...params } }).then((res: any) => res.data as T);
}

export function options<T = unknown>(resource: string): Promise<T> {
  return api.options(`/${resource}`).then((res: any) => res.data as T);
}

export function head(resource: string, id: string): Promise<Record<string, unknown>> {
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  return api.head(`/${resource}/${formattedId}`).then((res: any) => res.headers as Record<string, unknown>);
}

export function bulkCreate<T = unknown>(resource: string, items: Array<Record<string, unknown>>): Promise<T> {
  return api.post(`/${resource}/bulk`, items).then((res: any) => res.data as T);
}

export function bulkUpdate<T = unknown>(resource: string, updates: BulkUpdateItem[]): Promise<T> {
  return api.patch(`/${resource}/bulk`, updates).then((res: any) => res.data as T);
}

export function bulkDelete<T = unknown>(resource: string, ids: string[]): Promise<T> {
  return api.delete(`/${resource}/bulk`, { data: ids }).then((res: any) => res.data as T);
}

export function customRequest<T = unknown>(
  method: string,
  path: string,
  data: unknown = null,
  config: CustomRequestConfig = {},
): Promise<T> {
  const methodLower = method.toLowerCase();

  if (['post', 'put', 'patch'].includes(methodLower)) {
    const payload = data == null ? {} : data;
    return (api as any)[methodLower](`/${path}`, payload, config).then((res: any) => res.data as T);
  }

  if (['get', 'head'].includes(methodLower)) {
    return (api as any)[methodLower](`/${path}`, { ...config, params: data }).then((res: any) =>
      (methodLower === 'head' ? res.headers : res.data) as T,
    );
  }

  if (methodLower === 'delete') {
    const payload = data == null ? {} : data;
    return api.delete(`/${path}`, { ...config, data: payload }).then((res: any) => res.data as T);
  }

  throw new Error(`Método HTTP não suportado: ${method}`);
}

export function upsert<T = unknown>(resource: string, id: string, data: Record<string, unknown>): Promise<T> {
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  return api.put(`/${resource}/${formattedId}`, data).then((res: any) => res.data as T);
}

export function isValidImageBase64(base64String: string): boolean {
  if (!base64String) return false;
  const regex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
  return regex.test(base64String);
}

export function getImageMimeType(base64String: string): string | null {
  if (!base64String) return null;
  const matches = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  return matches ? matches[1] : null;
}

export function getImageSrc(imageData: string, options: GetImageSrcOptions = {}): string {
  if (!imageData) return options.fallbackImage || '/images/placeholder.png';
  if (imageData.startsWith('data:') || imageData.startsWith('http')) return imageData;
  const apiBaseURL = (api as any).defaults.baseURL as string;
  return `${apiBaseURL}${imageData.startsWith('/') ? '' : '/'}${imageData}`;
}

export function getBase64ImageSize(base64String: string): number {
  if (!base64String) return 0;
  const base64Data = base64String.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, '');
  return Math.round((base64Data.length * 3) / 4);
}

export function formatImageSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function logImageUploadDebug(
  context: string,
  file: File | Blob,
  extra: Record<string, unknown> = {},
): void {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'no-navigator';
    console.log('🧩 [ImageUploadDebug]', {
      context,
      fileName: (file as any) && (file as any).name,
      fileSize: (file as any) && (file as any).size,
      fileType: (file as any) && (file as any).type,
      userAgent: ua,
      timestamp: new Date().toISOString(),
      ...extra,
    });
  } catch (e) {
    console.warn('[ImageUploadDebug] Falha ao logar debug:', e);
  }
}

export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!src) { resolve(false); return; }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = getImageSrc(src);
  });
}

export async function normalizeImageFile(file: File): Promise<File> {
  if (!file) throw new Error('Arquivo não fornecido');

  const isHEIC = file.type === 'image/heic' || file.type === 'image/heif' ||
                 file.name.toLowerCase().endsWith('.heic') ||
                 file.name.toLowerCase().endsWith('.heif');

  if (!isHEIC) return file;

  try {
    let heic2any: any;
    try {
      heic2any = (await import('heic2any')).default;
    } catch (importError) {
      console.warn('heic2any não disponível, usando arquivo original:', importError);
      return file;
    }

    const convertedBlob = (await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8
    })) as Blob;

    const convertedFile = new File(
      [convertedBlob],
      file.name.replace(/\.(heic|heif)$/i, '.jpg'),
      { type: 'image/jpeg' }
    );

    console.log(' Arquivo HEIC/HEIF convertido para JPEG:', convertedFile.name);
    return convertedFile;
  } catch (error) {
    console.warn('Falha na conversão HEIC/HEIF, usando arquivo original:', error);
    return file;
  }
}
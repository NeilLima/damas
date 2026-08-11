// ============================================
// Post API - Endpoints da API de Posts
// ============================================

import { api } from '@/api/api';

const BASE_URL = '/posts';

export const postApi = {
  // Feed
  getFeed: (params?: { limit?: number; cursor?: string }) =>
    api.get(`${BASE_URL}`, { params }),

  // Posts do usuário
  getUserPosts: (userId: string, params?: { limit?: number; cursor?: string }) =>
    api.get(`${BASE_URL}/user/${userId}`, { params }),

  // Meus posts
  getMyPosts: (params?: { limit?: number; cursor?: string }) =>
    api.get(`${BASE_URL}/me`, { params }),

  // Post por ID
  getPostById: (id: string) =>
    api.get(`${BASE_URL}/${id}`),

  // Criar post
  createPost: (data: CreatePostPayload) =>
    api.post(BASE_URL, data),

  // Atualizar post
  updatePost: (id: string, data: UpdatePostPayload) =>
    api.patch(`${BASE_URL}/${id}`, data),

  // Deletar post
  deletePost: (id: string) =>
    api.delete(`${BASE_URL}/${id}`),

  // Compartilhar post
  sharePost: (id: string, content?: string) =>
    api.post(`${BASE_URL}/${id}/share`, { content }),

  // Fixar/Desafixar post
  pinPost: (id: string) =>
    api.patch(`${BASE_URL}/${id}/pin`),

  unpinPost: (id: string) =>
    api.patch(`${BASE_URL}/${id}/unpin`),

  // Reações
  addReaction: (postId: string, type: string) =>
    api.post(`${BASE_URL}/${postId}/reactions`, { type }),

  removeReaction: (postId: string) =>
    api.delete(`${BASE_URL}/${postId}/reactions`),

  getReactions: (postId: string) =>
    api.get(`${BASE_URL}/${postId}/reactions`),

  // Comentários
  getComments: (postId: string, params?: { limit?: number; cursor?: string; includeReplies?: boolean }) =>
    api.get(`${BASE_URL}/${postId}/comments`, { params }),

  addComment: (postId: string, content: string, parentId?: string) =>
    api.post(`${BASE_URL}/${postId}/comments`, { content, parentId }),
};

// ============================================
// Types - Payloads
// ============================================

export interface CreatePostPayload {
  content?: string;
  caption?: string;
  mediaType: string;
  media?: MediaPayload[];
  location?: LocationPayload;
  isPinned?: boolean;
  sharedPostId?: string;
  poll?: PollPayload;
  marketplace?: MarketplacePayload;
  donation?: DonationPayload;
  flashEvent?: FlashEventPayload;
  vibe?: string;
  insightText?: string;
  canOfferMentorship?: boolean;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdatePostPayload {
  content?: string;
  caption?: string;
  status?: string;
  isPinned?: boolean;
  vibe?: string;
  insightText?: string;
  canOfferMentorship?: boolean;
}

interface MediaPayload {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
}

interface LocationPayload {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

interface PollPayload {
  question: string;
  options: { text: string }[];
  endsAt?: string;
}

interface MarketplacePayload {
  price: number;
  currency?: string;
  condition?: string;
  link?: string;
  buttonText?: string;
  stock?: number;
}

interface DonationPayload {
  goal: number;
  description: string;
  currency?: string;
  endDate?: string;
}

interface FlashEventPayload {
  type: string;
  startsAt: string;
  endsAt?: string;
  maxParticipants?: number;
}

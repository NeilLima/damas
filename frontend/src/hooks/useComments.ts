'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { customRequest } from '@/services/crudService';

// ============================================
// Query Keys
// ============================================

export const commentKeys = {
  all: ['comments'] as const,
  entity: (entityType: string, entityId: string) => [...commentKeys.all, entityType, entityId] as const,
  reactions: (entityType: string, entityId: string) => [...commentKeys.all, 'reactions', entityType, entityId] as const,
};

// ============================================
// Types
// ============================================

export interface CommentData {
  id: string;
  _id?: string;
  content: string;
  text?: string;
  userId?: string;
  author?: {
    id: string;
    name: string;
    fullName?: string;
    username?: string;
    profileImage?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  replies?: CommentData[];
  repliesCount?: number;
  likesCount: number;
  isLiked?: boolean;
}

export interface AddCommentData {
  content: string;
  parentId?: string;
}

// ============================================
// Comments Queries
// ============================================

export function useComments(entityType: string, entityId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: commentKeys.entity(entityType, entityId),
    queryFn: () => fetchComments(entityType, entityId),
    enabled: !!entityType && !!entityId && enabled,
  });
}

async function fetchComments(entityType: string, entityId: string): Promise<CommentData[]> {
  // Endpoint do interactions retorna PaginatedComments { items, total, hasMore, nextCursor }
  const response = await customRequest<{ items: CommentData[]; total: number; hasMore: boolean; nextCursor?: string }>('GET', `interactions/comments/${entityType}/${entityId}`);
  return response.items || [];
}

// ============================================
// Comments Mutations
// ============================================

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      content,
      parentId,
    }: {
      entityType: string;
      entityId: string;
      content: string;
      parentId?: string;
    }) => addComment(entityType, entityId, content, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.entity(variables.entityType, variables.entityId),
      });
    },
  });
}

async function addComment(entityType: string, entityId: string, content: string, parentId?: string): Promise<CommentData> {
  return customRequest<CommentData>('POST', 'interactions/comments', {
    entityType,
    entityId,
    content,
    parentId,
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      // Invalidar todas as queries de comentários (genérico pois não temos entityType/entityId no contexto)
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}

async function deleteComment(commentId: string): Promise<void> {
  return customRequest('DELETE', `interactions/comments/${commentId}`);
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}

async function updateComment(commentId: string, content: string): Promise<CommentData> {
  return customRequest('PATCH', `interactions/comments/${commentId}`, { content });
}

// ============================================
// Reactions
// ============================================

export function useCommentReactions(entityType: string, entityId: string) {
  return useQuery({
    queryKey: commentKeys.reactions(entityType, entityId),
    queryFn: () => fetchReactionsSummary(entityType, entityId),
    enabled: !!entityType && !!entityId,
  });
}

async function fetchReactionsSummary(entityType: string, entityId: string) {
  return customRequest('GET', `/interactions/reactions/${entityType}/${entityId}/summary`);
}

export function useToggleReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
      type,
    }: {
      entityType: string;
      entityId: string;
      type: string;
    }) => toggleReaction(entityType, entityId, type),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.reactions(variables.entityType, variables.entityId),
      });
      // Para curtidas em comentários, também invalidar a query de comentários da entidade pai
      if (variables.entityType === 'galleryPhoto') {
        // Invalidar queries de comentários para todas as fotos
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey[0] === 'comments' && query.queryKey[1] === 'galleryPhoto';
          },
        });
      } else if (variables.entityType === 'comment') {
        // Para comentários de posts, invalidar queries de posts
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey[0] === 'comments' && query.queryKey[1] === 'post';
          },
        });
      }
    },
  });
}

async function toggleReaction(entityType: string, entityId: string, type: string) {
  return customRequest('POST', '/interactions/reactions', {
    entityType,
    entityId,
    type,
  });
}

export function useRemoveReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityType,
      entityId,
    }: {
      entityType: string;
      entityId: string;
    }) => removeReaction(entityType, entityId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.reactions(variables.entityType, variables.entityId),
      });
    },
  });
}

async function removeReaction(entityType: string, entityId: string) {
  return customRequest('DELETE', `/interactions/reactions/${entityType}/${entityId}`);
}

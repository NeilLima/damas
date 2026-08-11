'use client';

import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { compressImage } from '@/utils/imageCompression';

export interface FileUploadOptions {
  uploadService: (file: File) => Promise<{ mediaUrl: string; thumbUrl?: string }>;
  compressionOptions?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
  };
  acceptedTypes?: string[];
  maxFileSize?: number;
  createPreview?: boolean;
  onSuccess?: (result: FileUploadResult) => void;
  onError?: (error: Error) => void;
}

export interface FileUploadResult {
  serverUrl: string;
  previewUrl?: string;
  file: File;
  thumbUrl?: string;
  fileType: string;
  fileSize: number;
}

export interface FileUploadState {
  previewUrl: string | null;
  file: File | null;
  isUploading: boolean;
  serverUrl: string | null;
  error: string | null;
  progress: number;
}

export function useFileUpload(options: FileUploadOptions) {
  const [state, setState] = useState<FileUploadState>({
    previewUrl: null,
    file: null,
    isUploading: false,
    serverUrl: null,
    error: null,
    progress: 0,
  });

  const blobUrlsRef = useRef<Set<string>>(new Set());
  const processingRef = useRef<boolean>(false);

  const detectFileType = async (file: File): Promise<string> => {
    try {
      const bytes = await file.slice(0, 32).arrayBuffer();
      const uint8Array = new Uint8Array(bytes);

      if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
        return 'image/jpeg';
      }
      if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
        return 'image/png';
      }

      return file.type || 'application/octet-stream';
    } catch (error) {
      return file.type || 'application/octet-stream';
    }
  };

  // Criar preview usando URL.createObjectURL (mais rápido e sem base64)
  const createLocalPreview = useCallback(async (file: File): Promise<string | null> => {
    if (!options.createPreview) return null;

    try {
      const previewUrl = URL.createObjectURL(file);
      blobUrlsRef.current.add(previewUrl);
      return previewUrl;
    } catch (error) {
      console.error('❌ [useFileUpload] Erro ao criar ObjectURL:', error);
      return null;
    }
  }, [options.createPreview]);

  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const result = await options.uploadService(fileToUpload);
      return result;
    },
    onSuccess: (result, file) => {
      // Revogar ObjectURL anterior se existir
      if (state.previewUrl && state.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.previewUrl);
        blobUrlsRef.current.delete(state.previewUrl);
      }

      setState(prev => ({
        ...prev,
        serverUrl: result.mediaUrl,
        isUploading: false,
        progress: 100,
        error: null,
      }));

      const uploadResult: FileUploadResult = {
        serverUrl: result.mediaUrl,
        previewUrl: state.previewUrl || undefined,
        file,
        thumbUrl: result.thumbUrl,
        fileType: file.type,
        fileSize: file.size,
      };

      options.onSuccess?.(uploadResult);
    },
    onError: (error: Error) => {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error.message,
      }));

      options.onError?.(error);
    },
  });

  const handleFileUpload = useCallback(async (file: File) => {
    if (processingRef.current) return;

    if (options.acceptedTypes && !options.acceptedTypes.some(type => file.type.startsWith(type))) {
      const error = new Error(`Tipo de arquivo não aceito: ${file.type}`);
      options.onError?.(error);
      return;
    }

    if (options.maxFileSize && file.size > options.maxFileSize) {
      const error = new Error(`Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      options.onError?.(error);
      return;
    }

    processingRef.current = true;
    setState(prev => ({ ...prev, error: null, isUploading: true, progress: 0 }));

    try {
      // Criar preview via ObjectURL (rápido, sem base64)
      const previewUrl = await createLocalPreview(file);

      let fileToUpload = file;
      // Comprimir apenas imagens, nunca vídeos
      if (file.type.startsWith('image/') && options.compressionOptions) {
        fileToUpload = await compressImage(file, options.compressionOptions);
      }

      setState(prev => ({
        ...prev,
        file,
        previewUrl,
        progress: 10,
      }));

      uploadMutation.mutate(fileToUpload);
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Erro desconhecido');
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: uploadError.message,
      }));
      options.onError?.(uploadError);
    } finally {
      processingRef.current = false;
    }
  }, [options, createLocalPreview, uploadMutation]);

  const reset = useCallback(() => {
    if (state.previewUrl && state.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(state.previewUrl);
      blobUrlsRef.current.delete(state.previewUrl);
    }

    setState({
      previewUrl: null,
      file: null,
      isUploading: false,
      serverUrl: null,
      error: null,
      progress: 0,
    });
  }, [state.previewUrl]);

  const cleanup = useCallback(() => {
    blobUrlsRef.current.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    blobUrlsRef.current.clear();

    reset();
  }, [reset]);

  useState(() => {
    return () => {
      cleanup();
    };
  });

  return {
    state,
    handleFileUpload,
    reset,
    cleanup,
    isUploading: state.isUploading,
    hasFile: !!state.file,
    hasServerUrl: !!state.serverUrl,
    hasPreview: !!state.previewUrl,
    previewUrl: state.previewUrl,
    serverUrl: state.serverUrl,
    file: state.file,
    error: state.error,
    progress: state.progress,
  };
}

export function useImageUpload(uploadService: (file: File) => Promise<{ mediaUrl: string; thumbUrl?: string }>, options?: Partial<FileUploadOptions>) {
  return useFileUpload({
    uploadService,
    acceptedTypes: ['image/'],
    createPreview: true,
    compressionOptions: {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
    },
    maxFileSize: 10 * 1024 * 1024,
    ...options,
  });
}

export function useVideoUpload(uploadService: (file: File) => Promise<{ mediaUrl: string; thumbUrl?: string }>, options?: Partial<FileUploadOptions>) {
  return useFileUpload({
    uploadService,
    acceptedTypes: ['video/'],
    createPreview: true,
    maxFileSize: 100 * 1024 * 1024,
    ...options,
  });
}

export function useAudioUpload(uploadService: (file: File) => Promise<{ mediaUrl: string; thumbUrl?: string }>, options?: Partial<FileUploadOptions>) {
  return useFileUpload({
    uploadService,
    acceptedTypes: ['audio/'],
    createPreview: false,
    maxFileSize: 50 * 1024 * 1024,
    ...options,
  });
}
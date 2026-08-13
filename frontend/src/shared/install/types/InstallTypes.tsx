// ============================================
// Prompt de instalação do app como PWA
// ============================================
'use client';

export interface InstallPromptCallbacks {
  onInstall: () => void;
  onDismiss: () => void;
}

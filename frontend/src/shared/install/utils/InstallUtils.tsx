// ============================================
// Hook de instalação PWA (beforeinstallprompt)
// ============================================
'use client';

import { useState, useCallback, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const INSTALL_DISMISS_KEY = 'damas_install_dismissed';

/** Detecta se o app está rodando instalado (standalone/fullscreen/minimal-ui). */
const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  const md = window.matchMedia('(display-mode: standalone)');
  const f = window.matchMedia('(display-mode: fullscreen)');
  const mu = window.matchMedia('(display-mode: minimal-ui)');
  const ios = (navigator as unknown as { standalone?: boolean }).standalone === true;
  return md.matches || f.matches || mu.matches || ios;
};

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(INSTALL_DISMISS_KEY) === '1' || isStandalone();
    } catch {
      return isStandalone();
    }
  });

  useEffect(() => {
    // Se já estiver instalado, não registra nada nem mostra prompt.
    if (isStandalone()) {
      setDismissed(true);
      return;
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Defensivo: mesmo com o evento, se já estiver instalado, não mostra.
      if (isStandalone()) return;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const onAppInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
      setDismissed(true);
      try {
        localStorage.setItem(INSTALL_DISMISS_KEY, '1');
      } catch {
        /* noop */
      }
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    // Registra o service worker (requerido para instalação e offline).
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* noop */
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === 'accepted') {
      setCanInstall(false);
      setDismissed(true);
      try {
        localStorage.setItem(INSTALL_DISMISS_KEY, '1');
      } catch {
        /* noop */
      }
      return true;
    }
    return false;
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setCanInstall(false);
    try {
      localStorage.setItem(INSTALL_DISMISS_KEY, '1');
    } catch {
      /* noop */
    }
  }, []);

  return {
    canInstall,
    dismissed,
    install,
    dismiss,
    isStandalone,
  };
}

// ============================================
// Componente de prompt de instalação (PWA)
// Mostra banner na tela inicial; ao clicar abre
// modal de opções. Some se já instalado.
// ============================================
'use client';

import { useState } from 'react';
import { useInstallPrompt } from '../utils/InstallUtils';
import {
  StyledInstallOverlay,
  StyledInstallCard,
  StyledInstallIcon,
  StyledInstallTitle,
  StyledInstallText,
  StyledInstallButtons,
  StyledInstallPrimary,
  StyledInstallSecondary,
  StyledInstallBanner,
} from '../styles/InstallStyles';

export default function InstallPrompt() {
  const { canInstall, dismissed, install, dismiss } = useInstallPrompt();
  const [showModal, setShowModal] = useState(false);

  // Já instalado ou não há suporte: não mostra nada (a menos que esteja vendo o modal).
  if ((!canInstall && !showModal) || dismissed) return null;
  if (!canInstall && showModal) return null;

  const handleBannerInstall = () => setShowModal(true);

  const handleModalInstall = async () => {
    const ok = await install();
    if (!ok) setShowModal(true);
  };

  const handleModalLater = () => {
    setShowModal(false);
    dismiss();
  };

  return (
    <>
      {/* Banner inicial: convida a instalar o app */}
      {canInstall && !showModal && (
        <StyledInstallBanner onClick={handleBannerInstall}>
          <div className="banner-info">
            <span className="banner-icon">📲</span>
            <span className="banner-text">Instale o Jogo de Damas no seu celular</span>
          </div>
          <span className="banner-action">Instalar</span>
        </StyledInstallBanner>
      )}

      {/* Modal de opções */}
      {canInstall && showModal && (
        <StyledInstallOverlay onClick={handleModalLater}>
          <StyledInstallCard onClick={(e) => e.stopPropagation()}>
            <StyledInstallIcon>📲</StyledInstallIcon>
            <StyledInstallTitle>Instalar o Jogo de Damas?</StyledInstallTitle>
            <StyledInstallText>
              Instale o aplicativo para ter acesso rápido e jogar de forma mais fluida, inclusive
              sem conexão à internet.
            </StyledInstallText>
            <StyledInstallButtons>
              <StyledInstallPrimary onClick={handleModalInstall}>📲 Instalar agora</StyledInstallPrimary>
              <StyledInstallSecondary onClick={handleModalLater}>Agora não</StyledInstallSecondary>
            </StyledInstallButtons>
          </StyledInstallCard>
        </StyledInstallOverlay>
      )}
    </>
  );
}

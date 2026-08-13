import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jogo de Damas',
    short_name: 'Damas',
    description: 'Jogo de Damas em 3D — jogue contra o computador em qualquer dispositivo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1f1f1f',
    theme_color: '#667eea',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

import type { Metadata } from "next";
import { ClientProvider } from "./ClientProvider";

export const metadata: Metadata = {
  title: "Jogo de Damas",
  description: "Jogo de damas em 3D com Next.js, Three.js e Nest.js",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jogo de Damas",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
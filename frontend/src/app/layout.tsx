// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import './globals.css'; // REMOVA OU COMENTE ESTA LINHA

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Music AI Curatorship',
  description: 'Clone do Spotify com motor de recomendação Gemini AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* ADICIONE ESTA LINHA PARA O TAILWIND VIA CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      {/* Mantenha as classes no body se quiser o fundo padrão */}
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
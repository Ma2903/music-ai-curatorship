// frontend/src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// REMOVER: import './globals.css'; 
// (Deixamos fora para evitar o erro, as classes virão do Tailwind diretamente)

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
      {/* Aplicamos min-h-screen e a fonte diretamente no body, 
         usando Tailwind nas classes */}
      <body className={`${inter.className} min-h-screen`}> 
        {children}
      </body>
    </html>
  );
}
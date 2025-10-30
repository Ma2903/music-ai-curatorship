// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext'; // <<< IMPORTAR AuthProvider

// import './globals.css'; // Mantenha comentado

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
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-white`}>
        {/* <<< ENVOLVER O children COM AuthProvider >>> */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
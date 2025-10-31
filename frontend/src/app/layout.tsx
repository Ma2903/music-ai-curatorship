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
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
          }

          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-down {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }

          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }

          /* Screen reader only utility */
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }

          /* Ensure focus is always visible */
          *:focus-visible {
            outline: 2px solid #22c55e;
            outline-offset: 2px;
          }

          /* Smooth scroll behavior */
          html {
            scroll-behavior: smooth;
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
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
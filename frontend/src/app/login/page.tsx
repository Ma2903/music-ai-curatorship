// frontend/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/UI/Button';
import Link from 'next/link';
// --- ALTERADO: Removido AlertCircle ---
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
// --- ADICIONADO ---
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
// --- FIM DA ADIÇÃO ---

// Interface para o usuário do frontend
interface FrontendUser {
  id: number;
  email: string;
  name: string | null;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // --- REMOVIDO: Estado de erro ---
  // const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // --- REMOVIDO: setError(null) ---
    setIsLoading(true);

    if (!email || !password) {
      // --- ALTERADO: usa Swal.fire ---
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Email e senha são obrigatórios.',
        icon: 'error',
        background: '#181818',
        color: '#FFFFFF'
      });
      // --- FIM DA ALTERAÇÃO ---
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3333/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}`);
      }

      const { token, user } = data as { token: string; user: FrontendUser };
      login(token, user); // Salva no contexto/localStorage
      router.push('/'); // Redireciona para home

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error("Erro no login:", message);
      // --- ALTERADO: usa Swal.fire ---
      Swal.fire({
        title: 'Erro no Login',
        text: message,
        icon: 'error',
        background: '#181818',
        color: '#FFFFFF'
      });
      // --- FIM DA ALTERAÇÃO ---
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* Background gradient effect - Spotify inspired */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6 transform transition-transform hover:scale-110">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">Entrar no Music AI</h1>
          <p className="text-base text-neutral-400">Continue sua jornada musical</p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-3">
                Endereço de e-mail
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail
                    size={20}
                    className={`transition-colors duration-200 ${
                      emailFocused ? 'text-green-500' : 'text-neutral-500'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-neutral-600"
                  placeholder="nome@exemplo.com"
                  disabled={isLoading}
                  aria-describedby="email-description"
                />
              </div>
              <span id="email-description" className="sr-only">
                Digite seu endereço de e-mail cadastrado
              </span>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-white mb-3">
                Senha
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock
                    size={20}
                    className={`transition-colors duration-200 ${
                      passwordFocused ? 'text-green-500' : 'text-neutral-500'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full pl-12 pr-12 py-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-neutral-600"
                  placeholder="••••••••"
                  disabled={isLoading}
                  aria-describedby="password-description"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1"
                  disabled={isLoading}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <span id="password-description" className="sr-only">
                Digite sua senha
              </span>
            </div>

            {/* --- REMOVIDO: Bloco de erro --- */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold text-base rounded-full transition-all duration-200 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-lg shadow-green-500/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-neutral-900/50 text-neutral-400">ou</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-400 mb-4">
              Não tem uma conta?
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center w-full py-4 border-2 border-neutral-700 hover:border-white text-white font-bold text-base rounded-full transition-all duration-200 hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Inscrever-se no Music AI
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          <button className="text-sm text-neutral-400 hover:text-white underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1">
            Esqueceu sua senha?
          </button>
        </div>
      </div>
    </div>
  );
}
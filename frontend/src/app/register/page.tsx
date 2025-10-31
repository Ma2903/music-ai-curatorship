// frontend/src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// --- ALTERADO: Removido AlertCircle, CheckCircle2 ---
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// --- ADICIONADO ---
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
// --- FIM DA ADIÇÃO ---

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // --- REMOVIDO: Estados de erro e sucesso ---
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Fraca', color: 'bg-red-500' };
    if (password.length < 10) return { level: 2, label: 'Média', color: 'bg-yellow-500' };
    return { level: 3, label: 'Forte', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // --- REMOVIDO: Limpeza de estados ---
    setIsLoading(true);

    const showError = (message: string) => {
      Swal.fire({
        title: 'Erro no Registro',
        text: message,
        icon: 'error',
        background: '#181818',
        color: '#FFFFFF'
      });
      setIsLoading(false);
    };

    if (!email || !password || !name) {
      showError('Todos os campos são obrigatórios.'); return;
    }
    if (password.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres.'); return;
    }

    try {
      const response = await fetch('http://localhost:3333/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}`);
      }

      // --- ALTERADO: usa Swal.fire ---
      await Swal.fire({
        title: 'Sucesso!',
        text: 'Usuário registrado com sucesso! Redirecionando para o login...',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#181818',
        color: '#FFFFFF'
      });
      router.push('/login'); // Redireciona
      // --- FIM DA ALTERAÇÃO ---

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error("Erro no registro:", message);
      showError(message); // Usa a função de erro do SweetAlert
    } finally {
      // --- ALTERADO: Apenas seta isLoading ---
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
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">Inscrever-se grátis</h1>
          <p className="text-base text-neutral-400">Crie sua conta no Music AI</p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-white mb-3">
                Nome
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User
                    size={20}
                    className={`transition-colors duration-200 ${
                      nameFocused ? 'text-green-500' : 'text-neutral-500'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-neutral-600"
                  placeholder="Como devemos chamar você?"
                  disabled={isLoading}
                  aria-describedby="name-description"
                />
              </div>
              <span id="name-description" className="sr-only">
                Digite seu nome ou apelido
              </span>
            </div>

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
                Digite um endereço de e-mail válido
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full pl-12 pr-12 py-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-neutral-600"
                  placeholder="Crie uma senha forte"
                  disabled={isLoading}
                  aria-describedby="password-description password-strength"
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
                A senha deve ter pelo menos 6 caracteres
              </span>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2" id="password-strength">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.level
                            ? passwordStrength.color
                            : 'bg-neutral-700'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-400">
                    Força da senha: <span className="font-semibold">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* --- REMOVIDO: Bloco de Erro e Sucesso --- */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold text-base rounded-full transition-all duration-200 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-lg shadow-green-500/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Criando conta...
                </span>
              ) : (
                'Criar conta'
              )}
            </button>

            {/* Terms Notice */}
            <p className="text-xs text-center text-neutral-500 leading-relaxed">
              Ao clicar em Criar conta, você concorda com os{' '}
              <button className="underline hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded">
                Termos de Uso
              </button>{' '}
              do Music AI. Para saber mais sobre como coletamos, usamos, compartilhamos e protegemos seus dados pessoais, leia nossa{' '}
              <button className="underline hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded">
                Política de Privacidade
              </button>.
            </p>
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-400 mb-4">
              Já tem uma conta?
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-4 border-2 border-neutral-700 hover:border-white text-white font-bold text-base rounded-full transition-all duration-200 hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              Faça login no Music AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
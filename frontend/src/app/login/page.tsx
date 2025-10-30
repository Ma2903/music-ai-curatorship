// frontend/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/UI/Button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

// Interface para o usuário do frontend
interface FrontendUser {
  id: number;
  email: string;
  name: string | null;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Email e senha são obrigatórios.');
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
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl shadow-green-500/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Entrar</h1>
          <p className="text-neutral-400">Bem-vindo de volta ao Music AI!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="voce@email.com" disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">Senha</label>
            <input
              id="password" name="password" type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••" disabled={isLoading}
            />
          </div>
          {error && (<p className="text-sm text-red-500 text-center">{error}</p>)}
          <div>
            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} icon={<LogIn size={18} />}>
              Entrar
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-neutral-400 mt-8">
          Não tem uma conta?{' '}
          <Link href="/register" className="font-medium text-green-400 hover:text-green-300">Registre-se</Link>
        </p>
      </div>
    </div>
  );
}
// frontend/src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!email || !password || !name) {
      setError('Todos os campos são obrigatórios.'); setIsLoading(false); return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.'); setIsLoading(false); return;
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

      setSuccess('Usuário registrado com sucesso! Redirecionando para o login...');
      setTimeout(() => { router.push('/login'); }, 2000); // Redireciona após 2s

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error("Erro no registro:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl shadow-green-500/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-neutral-400">Junte-se ao Music AI Curatorship</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">Nome</label>
            <input
              id="name" name="name" type="text" autoComplete="name" required
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Seu nome" disabled={isLoading}
            />
          </div>
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
              id="password" name="password" type="password" autoComplete="new-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Mínimo 6 caracteres" disabled={isLoading}
            />
          </div>
          {error && (<p className="text-sm text-red-500 text-center">{error}</p>)}
          {success && (<p className="text-sm text-green-500 text-center">{success}</p>)}
          <div>
            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} icon={<UserPlus size={18} />}>
              Registrar
            </Button>
          </div>
        </form>
        <p className="text-center text-sm text-neutral-400 mt-8">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-green-400 hover:text-green-300">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
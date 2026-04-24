
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import {
  EnvelopeIcon, LockClosedIcon, EyeIcon,
  EyeSlashIcon, ScaleIcon, ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const loginSchema = z.object({
  email: z.string().email('Insira um email válido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try { await login(data); }
    finally { setIsLoading(false); }
  };

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-sidebar)' }}>
          <ScaleIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            Acesso ao Sistema
          </h1>
          <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
            Sistema Penal · República de Angola
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--text-secondary)' }}>
            Email institucional
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
              style={{ color: 'var(--text-muted)' }} />
            <input
              id="email"
              type="email"
              placeholder="utilizador@tribunal.gov.ao"
              autoComplete="email"
              className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-400' : ''
              }`}
              style={{
                backgroundColor: errors.email ? 'rgba(239,68,68,0.06)' : 'var(--input-bg)',
                borderColor:     errors.email ? '#f87171' : 'var(--input-border)',
                color:           'var(--input-text)',
              }}
              {...register('email')}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Senha */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="senha" className="block text-xs font-semibold uppercase tracking-wide"
              style={{ color: 'var(--text-secondary)' }}>
              Senha
            </label>
            <Link href="/esqueci-senha" className="text-xs text-blue-500 hover:text-blue-400 font-medium">
              Esqueceu?
            </Link>
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
              style={{ color: 'var(--text-muted)' }} />
            <input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`block w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.senha ? 'border-red-400' : ''
              }`}
              style={{
                backgroundColor: errors.senha ? 'rgba(239,68,68,0.06)' : 'var(--input-bg)',
                borderColor:     errors.senha ? '#f87171' : 'var(--input-border)',
                color:           'var(--input-text)',
              }}
              {...register('senha')}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {errors.senha && <p className="mt-1 text-xs text-red-500">{errors.senha.message}</p>}
        </div>

        {/* Manter ligado */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manter sessão activa</span>
        </label>

        {/* Botão de submissão */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#1a2744' }}
          onMouseEnter={e => !isLoading && (e.currentTarget.style.backgroundColor = '#243561')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1a2744')}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              A autenticar...
            </>
          ) : (
            <><ShieldCheckIcon className="h-4 w-4" />Entrar no Sistema</>
          )}
        </button>
      </form>

      {/* Divisor */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
            Sem conta?
          </span>
        </div>
      </div>

      {/* Registo */}
      <Link
        href="/register"
        className="block w-full py-2.5 px-4 text-center text-sm font-medium rounded-lg border transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface-2)',
          borderColor:     'var(--border)',
          color:           'var(--text-secondary)',
        }}
      >
        Solicitar acesso ao sistema
      </Link>

      {/* Nota institucional */}
      <div className="mt-5 p-3 rounded-lg border"
        style={{ backgroundColor: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <p className="text-xs leading-relaxed text-blue-500">
          <span className="font-semibold">Acesso restrito:</span> Este sistema destina-se exclusivamente a profissionais do sector judicial angolano credenciados.
        </p>
      </div>

      {/* Segurança */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
        <ShieldCheckIcon className="w-3.5 h-3.5" />
        <span>Ligação segura · Dados encriptados · SSL/TLS</span>
      </div>
    </>
  );
}
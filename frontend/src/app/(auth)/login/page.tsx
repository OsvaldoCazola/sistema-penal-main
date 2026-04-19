'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const loginSchema = z.object({
  email: z.string().email('Insira um email válido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex items-center justify-center flex-shrink-0">
          <ScaleIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">Acesso ao Sistema</h1>
          <p className="text-xs text-gray-400 leading-tight">Sistema Penal · República de Angola</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Email institucional
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              id="email"
              type="email"
              placeholder="utilizador@tribunal.gov.ao"
              autoComplete="email"
              className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Senha */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="senha" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Senha
            </label>
            <Link href="/esqueci-senha" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              Esqueceu?
            </Link>
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`block w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all ${
                errors.senha ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
              {...register('senha')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          {errors.senha && (
            <p className="mt-1 text-xs text-red-600">{errors.senha.message}</p>
          )}
        </div>

        {/* Manter ligado */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Manter sessão activa</span>
        </label>

        {/* Botão */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1a2744] hover:bg-[#243561] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
            <>
              <ShieldCheckIcon className="h-4 w-4" />
              Entrar no Sistema
            </>
          )}
        </button>
      </form>

      {/* Divisor */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-gray-400">Sem conta?</span>
        </div>
      </div>

      {/* Registo */}
      <Link
        href="/register"
        className="block w-full py-2.5 px-4 text-center text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
      >
        Solicitar acesso ao sistema
      </Link>

      {/* Nota institucional */}
      <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-700 leading-relaxed">
          <span className="font-semibold">Acesso restrito:</span> Este sistema destina-se exclusivamente a profissionais do sector judicial angolano credenciados.
        </p>
      </div>

      {/* Segurança */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheckIcon className="w-3.5 h-3.5" />
        <span>Ligação segura · Dados encriptados · SSL/TLS</span>
      </div>
    </>
  );
}

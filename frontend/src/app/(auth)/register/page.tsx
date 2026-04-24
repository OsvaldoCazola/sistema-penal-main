'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Insira um email válido'),
  senha: z.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  confirmarSenha: z.string(),
  role: z.nativeEnum(Role).optional(),
}).refine(d => d.senha === d.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: Role.JUIZ,
    label: 'Juiz',
    descricao: 'Gestão de processos, sentenças e jurisprudência',
    icon: ScaleIcon,
  },
  {
    value: Role.PROCURADOR,
    label: 'Procurador',
    descricao: 'Ministério Público, investigação e acusações',
    icon: BuildingLibraryIcon,
  },
  {
    value: Role.ADVOGADO,
    label: 'Advogado',
    descricao: 'Gestão de processos e consulta de jurisprudência',
    icon: BriefcaseIcon,
  },
  {
    value: Role.ESTUDANTE,
    label: 'Estudante de Direito',
    descricao: 'Acesso ao modo de estudo e casos práticos',
    icon: AcademicCapIcon,
  },
];

const inputCls = 'block w-full px-3 py-2.5 text-sm border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.JUIZ);
  const { register: registerUser } = useAuth();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: Role.JUIZ },
  });

  const senha = watch('senha', '');
  const strength = {
    length:    senha.length >= 6,
    uppercase: /[A-Z]/.test(senha),
    number:    /[0-9]/.test(senha),
  };
  const strengthPct = Object.values(strength).filter(Boolean).length / 3 * 100;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({ nome: data.nome, email: data.email, senha: data.senha, role: selectedRole });
    } finally { setIsLoading(false); }
  };

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#1a2744] rounded-lg flex items-center justify-center flex-shrink-0">
          <ScaleIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">Solicitar Acesso</h1>
          <p className="text-xs text-gray-400">Sistema Penal · República de Angola</p>
        </div>
      </div>

      {/* Indicador de passos */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              s < step ? 'bg-emerald-500 text-white' : s === step ? 'bg-[#1a2744] text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {s < step ? <CheckCircleIcon className="h-3.5 w-3.5" /> : s}
            </div>
            <span className={`text-xs ${s === step ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
              {s === 1 ? 'Dados pessoais' : 'Função'}
            </span>
            {s < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Passo 1: Dados pessoais ── */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Nome completo *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  {...register('nome')}
                  type="text"
                  placeholder="Nome e apelido"
                  className={`${inputCls} pl-9 ${errors.nome ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Email institucional *
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="utilizador@tribunal.gov.ao"
                  className={`${inputCls} pl-9 ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Senha *
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  {...register('senha')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  className={`${inputCls} pl-9 pr-10 ${errors.senha ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.senha && <p className="mt-1 text-xs text-red-600">{errors.senha.message}</p>}
              {/* Força */}
              {senha && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${strengthPct}%`, background: strengthPct === 100 ? '#059669' : strengthPct >= 66 ? '#D97706' : '#DC2626' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Confirmar senha *
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  {...register('confirmarSenha')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  className={`${inputCls} pl-9 ${errors.confirmarSenha ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.confirmarSenha && <p className="mt-1 text-xs text-red-600">{errors.confirmarSenha.message}</p>}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] transition-colors mt-2"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ── Passo 2: Função ── */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">Seleccione a sua função</p>
            <div className="space-y-2">
              {roleOptions.map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRole === opt.value
                      ? 'border-[#1a2744] bg-[#1a2744]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={selectedRole === opt.value}
                    onChange={() => setSelectedRole(opt.value)}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedRole === opt.value ? 'bg-[#1a2744] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <opt.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${selectedRole === opt.value ? 'text-[#1a2744]' : 'text-gray-700'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{opt.descricao}</p>
                  </div>
                  {selectedRole === opt.value && (
                    <CheckCircleIcon className="h-4 w-4 text-[#1a2744] flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                ← Voltar
              </button>
              <button type="submit" disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] disabled:opacity-60 transition-colors">
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <ShieldCheckIcon className="h-4 w-4" />}
                {isLoading ? 'A registar...' : 'Criar Conta'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Link para login */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-gray-400">Já tem conta?</span>
        </div>
      </div>
      <Link href="/login"
        className="block w-full py-2.5 text-center text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
        Entrar no sistema
      </Link>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheckIcon className="w-3.5 h-3.5" />
        <span>Acesso sujeito a aprovação pela administração</span>
      </div>
    </>
  );
}

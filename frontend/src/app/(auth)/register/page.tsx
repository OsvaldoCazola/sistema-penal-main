'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  BriefcaseIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Por favor, insira um email válido'),
  senha: z.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
  confirmarSenha: z.string(),
  role: z.nativeEnum(Role).optional(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const roleOptions = [
  { value: Role.JUIZ, label: 'Juiz', descricao: 'Gestão de processos, sentenças e jurisprudência', icon: '⚖️' },
  { value: Role.PROCURADOR, label: 'Procurador', descricao: 'Ministério Público, investigação e acusações', icon: '🏛️' },
  { value: Role.ADVOGADO, label: 'Advogado', descricao: 'Gestão de processos e consulta de jurisprudência', icon: '⚖️' },
  { value: Role.ESTUDANTE, label: 'Estudante de Direito', descricao: 'Acesso ao modo de estudo e casos práticos', icon: '📚' },
];

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.JUIZ);
  const { register: registerUser } = useAuth();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: Role.JUIZ,
    },
  });

  const senha = watch('senha', '');
  
  const passwordStrength = {
    length: senha.length >= 6,
    uppercase: /[A-Z]/.test(senha),
    number: /[0-9]/.test(senha),
  };

  const strengthPercentage = Object.values(passwordStrength).filter(Boolean).length / 3 * 100;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const registerData = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        role: selectedRole,
      };
      
      await registerUser(registerData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Barra decorativa institucional */}
      <div className="flex h-1 rounded-sm overflow-hidden mb-6">
        <div className="flex-1 bg-primary-800"></div>
        <div className="flex-1 bg-primary-600"></div>
        <div className="flex-1 bg-primary-800"></div>
      </div>

      {/* Cabeçalho com ícone decorativo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4 transform hover:scale-105 transition-transform">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Criar Nova Conta
        </h2>
        <p className="text-gray-500">
          Junte-se à plataforma de justiça digital de Angola
        </p>
      </div>

      {/* Indicador de passos melhorado */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
          step >= 1 
            ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30' 
            : 'bg-gray-100 text-gray-400'
        }`}>
          1
        </div>
        <div className="relative w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div 
            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out ${
              step >= 2 ? 'w-full' : 'w-0'
            }`} 
          />
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
          step >= 2 
            ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30' 
            : 'bg-gray-100 text-gray-400'
        }`}>
          2
        </div>
      </div>

      {/* Etiquetas dos passos */}
      <div className="flex justify-center gap-8 mb-6">
        <span className={`text-xs font-medium transition-colors ${step === 1 ? 'text-primary-600' : 'text-gray-400'}`}>
          Dados Pessoais
        </span>
        <span className={`text-xs font-medium transition-colors ${step === 2 ? 'text-primary-600' : 'text-gray-400'}`}>
          Segurança
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {step === 1 && (
          <div className="animate-in slide-in-from-right duration-300">
            {/* Nome */}
            <div className="mb-5">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nome completo
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="nome"
                  type="text"
                  placeholder="Ex: João Manuel da Silva"
                  className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white ${
                    errors.nome ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  {...register('nome')}
                />
              </div>
              {errors.nome && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.nome.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.ao"
                  className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Tipo de utilizador - Cards interativos */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de utilizador
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleRoleSelect(option.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      selectedRole === option.value
                        ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{option.icon}</span>
                      <span className={`text-sm font-medium ${
                        selectedRole === option.value ? 'text-primary-700' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {option.descricao}
                    </p>
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('role')} value={selectedRole} />
            </div>

            <Button
              type="button"
              className="w-full py-3 text-base font-semibold group bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
              size="lg"
              onClick={() => setStep(2)}
            >
              <span className="flex items-center justify-center gap-2">
                Continuar
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-left duration-300">
            {/* Senha */}
            <div className="mb-5">
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1.5">
                Criar senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  className={`block w-full pl-11 pr-12 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white ${
                    errors.senha ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  {...register('senha')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.senha.message}
                </p>
              )}
              
              {/* Barra de força da senha */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Força da senha</span>
                  <span className={`text-xs font-medium ${
                    strengthPercentage === 100 ? 'text-green-600' : 
                    strengthPercentage >= 66 ? 'text-yellow-600' : 'text-red-500'
                  }`}>
                    {strengthPercentage === 100 ? 'Forte' : 
                     strengthPercentage >= 66 ? 'Média' : 'Fraca'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      strengthPercentage === 100 ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                      strengthPercentage >= 66 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${strengthPercentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className={`flex items-center gap-1.5 p-2 rounded-lg transition-all ${
                    passwordStrength.length ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'
                  }`}>
                    <CheckCircleIcon className={`w-4 h-4 ${passwordStrength.length ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>6+ chars</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-2 rounded-lg transition-all ${
                    passwordStrength.uppercase ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'
                  }`}>
                    <CheckCircleIcon className={`w-4 h-4 ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>Maiúscula</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-2 rounded-lg transition-all ${
                    passwordStrength.number ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'
                  }`}>
                    <CheckCircleIcon className={`w-4 h-4 ${passwordStrength.number ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>Número</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmar senha */}
            <div className="mb-5">
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmar senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="confirmarSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  className={`block w-full pl-11 pr-12 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white ${
                    errors.confirmarSenha ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  {...register('confirmarSenha')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.confirmarSenha.message}
                </p>
              )}
            </div>

            {/* Termos com estilo melhorado */}
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all group">
              <input 
                type="checkbox" 
                required
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors" 
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-700">
                Li e aceito os{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                  Termos de Uso
                </a>
                {' '}e a{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                  Política de Privacidade
                </a>
              </span>
            </label>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1 py-3 group border-2 hover:bg-gray-50"
                size="lg"
                onClick={() => setStep(1)}
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Voltar
                </span>
              </Button>
              <Button 
                type="submit" 
                className="flex-1 py-3 text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all" 
                size="lg" 
                isLoading={isLoading}
              >
                Criar Conta
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Separador */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Já tem conta?</span>
        </div>
      </div>

      {/* Link para login */}
      <Link
        href="/login"
        className="block w-full py-3 px-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-center hover:bg-gray-50 hover:border-primary-300 hover:text-primary-700 transition-all group"
      >
        <span className="flex items-center justify-center gap-2">
          Entrar no Sistema
          <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </span>
      </Link>

      {/* Informação adicional com estilo angolano */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-amber-50 rounded-xl border border-primary-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-200/30 to-amber-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-primary-800">
              <strong>Bem-vindo ao Sistema Penal de Angola.</strong> O seu registo será validado 
              pela nossa equipa para garantir a segurança da plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

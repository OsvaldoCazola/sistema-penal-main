'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  EnvelopeIcon, 
  ScaleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const forgotPasswordSchema = z.object({
  email: z.string().email('Por favor, insira um email válido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function EsqueciSenhaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // TODO: Quando o backend estiver implementado, usar:
      // await api.post('/auth/esqueci-senha', { email: data.email });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulação
      setIsSubmitted(true);
      toast.success('Instruções de recuperação enviadas para o seu email!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative">
        <div className="flex h-1 rounded-full overflow-hidden mb-6">
          <div className="flex-1 bg-[#CC092F]"></div>
          <div className="flex-1 bg-black"></div>
          <div className="flex-1 bg-[#FFCC00]"></div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Email Enviado!
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Verifique a sua caixa de correio eletrónico para instruções de recuperação de senha.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Se não receber o email em 5 minutos, verifique a pasta de spam ou contacte o administrador do sistema.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Voltar ao Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Barra decorativa com cores de Angola */}
      <div className="flex h-1 rounded-full overflow-hidden mb-6">
        <div className="flex-1 bg-[#CC092F]"></div>
        <div className="flex-1 bg-black"></div>
        <div className="flex-1 bg-[#FFCC00]"></div>
      </div>

      {/* Cabeçalho */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg shadow-primary-600/25 mb-3">
          <ScaleIcon className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Recuperar Palavra-passe
        </h2>
        <p className="text-sm text-gray-500">
          Informe o seu email institucional para receber as instruções
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email institucional
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <EnvelopeIcon className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="exemplo@tribunal.gov.ao"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900 placeholder-gray-400"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#CC092F] to-[#9B0724] hover:from-[#9B0724] hover:to-[#7A051C] py-2.5"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              A processar...
            </span>
          ) : (
            'Enviar Instruções'
          )}
        </Button>
      </form>

      {/* Link para voltar ao login */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Voltar ao Login
        </Link>
      </div>
    </div>
  );
}

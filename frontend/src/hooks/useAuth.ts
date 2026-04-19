'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import type { LoginRequest, RegisterRequest } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth, isAuthenticated, user, isLoading, hasRole } = useAuthStore();

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      setAuth(response.usuario, response.accessToken, response.refreshToken);
      toast.success('Login realizado com sucesso!');
      // Verificar se há uma URL de retorno salva
      const returnUrl = localStorage.getItem('returnUrl');
      localStorage.removeItem('returnUrl'); // Limpar após uso
      router.push(returnUrl || '/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      toast.error(message);
      throw error;
    }
  }, [setAuth, router]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      setAuth(response.usuario, response.accessToken, response.refreshToken);
      toast.success('Conta criada com sucesso!');
      // Verificar se há uma URL de retorno salva
      const returnUrl = localStorage.getItem('returnUrl');
      localStorage.removeItem('returnUrl'); // Limpar após uso
      router.push(returnUrl || '/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast.error(message);
      throw error;
    }
  }, [setAuth, router]);

  const logout = useCallback(async () => {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

    // Limpar estado local primeiro para garantir que o usuário seja desconectado imediatamente
    clearAuth();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Erro no logout API:', error);
    } finally {
      router.replace('/login');
      toast.success('Logout realizado com sucesso!');
    }
  }, [clearAuth, router]);

  return {
    login,
    register,
    logout,
    isAuthenticated,
    user,
    isLoading,
    hasRole,
  };
}

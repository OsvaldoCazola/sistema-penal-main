import api from '@/lib/api';
import type { AuthResponse, LoginRequest, RegisterRequest, Usuario } from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refresh_token: refreshToken });
  },

  async getMe(): Promise<Usuario> {
    const response = await api.get<Usuario>('/usuarios/me');
    return response.data;
  },

  async changePassword(senhaAtual: string, novaSenha: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/usuarios/me/alterar-senha', {
      senhaAtual,
      novaSenha,
    });
    return response.data;
  },
};

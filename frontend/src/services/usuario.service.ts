'use client';

import api from '@/lib/api';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  ativo: boolean;
  createdAt?: string;
  ultimoLogin?: string;
}

export interface UsuarioPage {
  content: Usuario[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CreateUsuarioRequest {
  email: string;
  senha: string;
  nome: string;
  role: string;
}

export const usuarioService = {
  async listar(page: number = 0, size: number = 50): Promise<UsuarioPage> {
    const response = await api.get<any>('/usuarios', {
      params: { page, size }
    });
    // Converter role de enum para string
    const data = response.data;
    if (data.content) {
      data.content = data.content.map((u: any) => ({
        ...u,
        role: u.role?.name || u.role,
        ativo: u.ativo
      }));
    }
    return data;
  },

  async buscarPorId(id: string): Promise<Usuario> {
    const response = await api.get<any>(`/usuarios/${id}`);
    const u = response.data;
    return {
      ...u,
      role: u.role?.name || u.role
    };
  },

  async criar(dados: CreateUsuarioRequest): Promise<Usuario> {
    const response = await api.post<any>('/usuarios', dados);
    const u = response.data;
    return {
      ...u,
      role: u.role?.name || u.role
    };
  },

  async alterarRole(id: string, role: string): Promise<Usuario> {
    const response = await api.patch<any>(`/usuarios/${id}/role`, { role });
    const u = response.data;
    return {
      ...u,
      role: u.role?.name || u.role
    };
  },

  async ativar(id: string): Promise<void> {
    await api.post(`/usuarios/${id}/ativar`);
  },

  async desativar(id: string): Promise<void> {
    await api.post(`/usuarios/${id}/desativar`);
  },

  async redefinirSenha(id: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/usuarios/${id}/resetar-senha`);
    return response.data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },

  async estatisticas(): Promise<any> {
    const response = await api.get('/usuarios/estatisticas');
    return response.data;
  }
};

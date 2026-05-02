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
  role: 'ADMIN' | 'ESTUDANTE';
}

const mapUsuario = (raw: any): Usuario => ({
  id: raw.id,
  email: raw.email,
  nome: raw.nome,
  role: raw.role,
  ativo: raw.ativo,
  createdAt: raw.createdAt,
  ultimoLogin: raw.ultimoLogin,
});

export const usuarioService = {
  async listar(page: number = 0, size: number = 50): Promise<UsuarioPage> {
    const { data } = await api.get<UsuarioPage>('/usuarios', { params: { page, size } });
    return {
      ...data,
      content: data.content.map(mapUsuario),
    };
  },

  async criar(dados: CreateUsuarioRequest): Promise<Usuario> {
    const { data } = await api.post<Usuario>('/usuarios', dados);
    return mapUsuario(data);
  },

  async alterarRole(id: string, role: 'ADMIN' | 'ESTUDANTE'): Promise<Usuario> {
    const { data } = await api.patch<Usuario>(`/usuarios/${id}/role`, { role });
    return mapUsuario(data);
  },

  async ativar(id: string): Promise<void> {
    await api.post(`/usuarios/${id}/ativar`);
  },

  async desativar(id: string): Promise<void> {
    await api.post(`/usuarios/${id}/desativar`);
  },

  async toggleAtivo(usuario: Usuario): Promise<void> {
    if (usuario.ativo) {
      await usuarioService.desativar(usuario.id);
    } else {
      await usuarioService.ativar(usuario.id);
    }
  },

  async resetarSenha(id: string, novaSenha: string): Promise<void> {
    await api.post(`/usuarios/${id}/resetar-senha`, { novaSenha });
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },

  async estatisticas(): Promise<{ totalAtivos: number; admins: number; estudantes: number }> {
    const { data } = await api.get('/usuarios/estatisticas');
    return data;
  },
};

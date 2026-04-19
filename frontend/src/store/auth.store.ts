import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario, Role } from '@/types';

interface AuthState {
  user: Usuario | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: Usuario, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          document.cookie = 'accessToken=; path=/; max-age=0';
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      hasRole: (roles) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

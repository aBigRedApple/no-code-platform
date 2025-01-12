import { create } from 'zustand';

type AuthState = {
  user: { id: number; email: string; name: string; avatar: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: { id: number; email: string; name: string; avatar: string }, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => {
    localStorage.setItem('token', token); // 存储 token 到 localStorage
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token'); // 清除 localStorage 中的 token
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
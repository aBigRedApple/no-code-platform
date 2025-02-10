import { create } from 'zustand';
import Cookies from 'js-cookie';

type User = {
  id: number;
  email: string;
  name: string;
  avatar: string;
  pwd: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
};

const cookieOptions = {
  expires: new Date(Date.now() +  60 * 60 * 1000), 
  secure: true,
  sameSite: 'strict' as const,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(Cookies.get('user') || 'null'),
  token: Cookies.get('token') || null,
  isAuthenticated: !!Cookies.get('token'),

  login: (user, token) => {
    Cookies.set('token', token, cookieOptions);
    Cookies.set('user', JSON.stringify(user), cookieOptions);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    set((state) => {
      if (!state.user) return state;

      // 合并原用户信息和更新的数据
      const newUser = { ...state.user, ...updatedUser };
      // 更新 cookies
      Cookies.set('user', JSON.stringify(newUser), cookieOptions);
      return { user: newUser };
    });
  },
}));

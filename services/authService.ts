import api from '@/utils/api';

type RegisterData = {
  email: string;
  password: string;
  name: string;
};

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
};

// 注册
export const register = async (data: RegisterData) => {
  const response = await api.post('/register', data);
  return response;
};

// 登录
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post('/login', data);
  return response;
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  const response = await api.get('/me');
  return response;
};
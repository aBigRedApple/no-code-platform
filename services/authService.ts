import api from '@/utils/api';
import axios from 'axios';

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
    avatar: string;
  };
};

type ChangePasswordData = {
  id: number;
  newPassword: string;
};

// 注册
export const register = async (data: RegisterData) => {
  try {
    const response = await api.post('/register', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error || '注册失败，请稍后重试!');
  }
};

// 登录
export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    // 直接使用 axios 发送请求，不使用封装后的 api 实例
    const response = await axios.post('http://localhost:3000/api/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    // 处理错误
    throw new Error(error.response?.data?.message || 'An error occurred during login.');
  }
};

// 更新用户信息
export const updateUserProfile = async (data: FormData) => {
  try {
    const response = await api.post('/update-profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw new Error('更新用户信息失败');
  }
};

// 修改密码
export const changePassword = async (data: ChangePasswordData) => {
  try {
    const response = await api.post('/change-password', data);
    return response.data;
  } catch (error) {
    throw new Error('修改密码失败');
  }
};
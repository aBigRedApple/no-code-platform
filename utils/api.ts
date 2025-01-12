import axios from 'axios';

// 创建 Axios 实例
const api = axios.create({
  baseURL: '/api', // 设置基础 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 中获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 处理 HTTP 错误状态码
      const { status, data } = error.response;
      if (status === 401) {
        // 未授权，跳转到登录页面
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(data.message || '请求失败');
    }
    return Promise.reject('网络错误，请稍后重试');
  }
);

export default api;
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await axios.post('/api/v1/auth/refresh', {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
          useAuthStore.getState().setTokens(accessToken, newRefreshToken);
          
          // Retry the original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        } catch {
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    
    const message = error.response?.data?.error?.message || 'حدث خطأ غير متوقع';
    return Promise.reject(new Error(message));
  }
);

export default api;

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
};

// Articles API
export const articlesApi = {
  getAll: (params?: any) => api.get('/articles', { params }),
  getOne: (id: string) => api.get(`/articles/${id}`),
  create: (data: any) => api.post('/articles', data),
  update: (id: string, data: any) => api.patch(`/articles/${id}`, data),
  delete: (id: string) => api.delete(`/articles/${id}`),
  publish: (id: string) => api.post(`/articles/${id}/publish`),
  archive: (id: string) => api.post(`/articles/${id}/archive`),
};

// Categories API
export const categoriesApi = {
  getAll: (includeInactive?: boolean) =>
    api.get('/categories', { params: { includeInactive } }),
  getTree: () => api.get('/categories/tree'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Tags API
export const tagsApi = {
  getAll: (search?: string, type?: string) =>
    api.get('/tags', { params: { search, type } }),
  getPopular: (limit?: number) => api.get('/tags/popular', { params: { limit } }),
  getOne: (id: string) => api.get(`/tags/${id}`),
  create: (data: any) => api.post('/tags', data),
  update: (id: string, data: any) => api.patch(`/tags/${id}`, data),
  delete: (id: string) => api.delete(`/tags/${id}`),
};

// Media API
export const mediaApi = {
  getAll: (params?: any) => api.get('/media', { params }),
  getOne: (id: string) => api.get(`/media/${id}`),
  upload: (file: File, data?: any) => {
    const formData = new FormData();
    formData.append('file', file);
    if (data) {
      Object.keys(data).forEach((key) => {
        if (data[key]) formData.append(key, data[key]);
      });
    }
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id: string, data: any) => api.patch(`/media/${id}`, data),
  delete: (id: string) => api.delete(`/media/${id}`),
  getFolders: (parentId?: string) =>
    api.get('/media/folders', { params: { parentId } }),
  createFolder: (name: string, parentId?: string) =>
    api.post('/media/folders', { name, parentId }),
  deleteFolder: (id: string) => api.delete(`/media/folders/${id}`),
};

// Users API
export const usersApi = {
  getAll: (params?: any) => api.get('/users', { params }),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};


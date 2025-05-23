import axios from 'axios';

// Берём refresh_token из localStorage
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Храним access_token в памяти
let accessToken: string | null = null;
export const setAccessToken = (token: string) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: 'http://localhost:8080/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем Authorization
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Обработка 401 → попытка рефреша
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;
      try {
        const refreshRes = await api.post('/refresh', {
          refresh_token: getRefreshToken(),
        });
        const { access_token } = refreshRes.data;
        setAccessToken(access_token);
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

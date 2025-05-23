import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAccessToken = (token: string) => {
  localStorage.setItem('access_token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAccessToken = () => {
  localStorage.removeItem('access_token');
  delete api.defaults.headers.common['Authorization'];
};

// === сразу восстанавливаем, если access_token есть ===
const storedToken = localStorage.getItem('access_token');
if (storedToken) {
  setAccessToken(storedToken);
}

export default api;

import { useNavigate } from 'react-router-dom';
import api, { setAccessToken } from '@api/axios';
import AuthForm from '@components/AuthForm';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    const res = await api.post('/login', { username, password });
    localStorage.setItem('refresh_token', res.data.refresh_token);
    setAccessToken(res.data.access_token);
    navigate('/me');
  };

  return <AuthForm mode="login" onSubmit={handleLogin} />;
}

export default LoginPage;

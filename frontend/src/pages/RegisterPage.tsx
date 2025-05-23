import { useNavigate } from 'react-router-dom';
import api, { setAccessToken } from '@api/axios';
import AuthForm from '@components/AuthForm';

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (username: string, password: string) => {
    const res = await api.post('/register', { username, password });
    localStorage.setItem('refresh_token', res.data.refresh_token);
    setAccessToken(res.data.access_token);
    navigate('/me');
  };

  return <AuthForm mode="register" onSubmit={handleRegister} />;
}

export default RegisterPage;

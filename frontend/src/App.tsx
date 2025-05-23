import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import MePage from '@pages/MePage';
import PrivateRoute from '@routes/PrivateRoute';
import { useAuth } from '@context/AuthContext';

function App() {
  const { initialized } = useAuth();

  if (!initialized) return <p>Загрузка авторизации...</p>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/me" element={
        <PrivateRoute>
          <MePage />
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

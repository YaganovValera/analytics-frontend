import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import MePage from '@pages/MePage';
import PrivateRoute from '@routes/PrivateRoute';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/me" element={
        <PrivateRoute>
          <MePage />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;

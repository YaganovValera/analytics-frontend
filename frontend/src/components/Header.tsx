import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/me" style={styles.link}>Профиль</Link>
        {user?.roles.includes('admin') && (
          <Link to="/admin" style={styles.link}>Админка</Link>
        )}
        <Link to="/candles">Аналитика</Link>
      </nav>
      <div style={styles.user}>
        <span style={{ marginRight: '1rem' }}>
          👤 {user?.user_id}
        </span>
        <button onClick={handleLogout} style={styles.button}>
          Выйти
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: '1rem',
    backgroundColor: '#f2f2f2',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
} as const;

export default Header;

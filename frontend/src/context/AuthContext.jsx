import { createContext, useContext, useEffect, useState } from 'react';
import { adminMe } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('cc_admin_token'));
  const [username, setUsername] = useState(localStorage.getItem('cc_admin_username'));
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    adminMe()
      .then((data) => setUsername(data.username))
      .catch(() => logout())
      .finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function login(newToken, newUsername) {
    localStorage.setItem('cc_admin_token', newToken);
    localStorage.setItem('cc_admin_username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  }

  function logout() {
    localStorage.removeItem('cc_admin_token');
    localStorage.removeItem('cc_admin_username');
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

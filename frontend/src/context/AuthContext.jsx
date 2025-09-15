import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();

  const saveToken = (token) => {
    setToken(token);

    sessionStorage.setItem('token', token);
  };

  const register = async (credentials) => {
    try {
      const res = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();

      saveToken(data.token);
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();

      saveToken(data.token);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem('token');

      setToken(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const value = { token, register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

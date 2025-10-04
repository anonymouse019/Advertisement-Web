import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on app start
    const token = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    console.log('AuthContext: Initial load - User:', storedUser );  // DEBUG
    if (token && storedUser ) {
      try {
        setUser (JSON.parse(storedUser ));
      } catch (err) {
        console.error('AuthContext: Parse error:', err);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser (userData);
    console.log('AuthContext: Login - Set user:', userData);  // DEBUG
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser (null);
    console.log('AuthContext: Logout');  // DEBUG
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('mcj_admin_auth') === 'true';
  });

  const login = () => {
    setIsAdmin(true);
    localStorage.setItem('mcj_admin_auth', 'true');
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('mcj_admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

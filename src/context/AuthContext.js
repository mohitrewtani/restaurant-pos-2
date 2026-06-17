// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Change this password before going live
const MANAGER_PASSWORD = process.env.REACT_APP_MANAGER_PASSWORD || 'manager123';

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('mgr_auth') === 'true'
  );

  const login = (password) => {
    if (password === MANAGER_PASSWORD) {
      sessionStorage.setItem('mgr_auth', 'true');
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('mgr_auth');
    setAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

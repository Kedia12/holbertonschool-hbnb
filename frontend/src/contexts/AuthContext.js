import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getApiErrorMessage } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => parseUserFromToken(localStorage.getItem('token')));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setUser(parseUserFromToken(token));
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const { access_token } = response.data;
      setToken(access_token);
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      return await login(email, password);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: !!user?.isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function parseUserFromToken(token) {
  if (!token || token.split('.').length !== 3) {
    return null;
  }

  try {
    const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = base64Payload + '='.repeat((4 - (base64Payload.length % 4)) % 4);
    const payload = JSON.parse(atob(paddedPayload));
    return {
      id: payload.sub || null,
      email: payload.email || null,
      isAdmin: !!payload.is_admin,
    };
  } catch (error) {
    return null;
  }
}

export const useAuth = () => useContext(AuthContext);

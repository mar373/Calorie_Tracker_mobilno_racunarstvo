import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, setAuthToken } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load persisted authentication state on startup
    const loadStorageData = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setAuthToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading auth data from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const extractErrorMessage = (error: any): string => {
    // Extract message from axios server response
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message === 'Network Error') return 'Ne mogu da se povežem sa serverom. Provjerite da li server radi.';
    return error?.message || 'Došlo je do greške. Pokušajte ponovo.';
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const { token: jwtToken, user: loggedUser } = response;

      await AsyncStorage.setItem(TOKEN_KEY, jwtToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(loggedUser));

      setToken(jwtToken);
      setUser(loggedUser);
      setAuthToken(jwtToken);
    } catch (error: any) {
      setAuthToken(null);
      throw new Error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.register(name, email, password);
      const { token: jwtToken, user: registeredUser } = response;

      await AsyncStorage.setItem(TOKEN_KEY, jwtToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(registeredUser));

      setToken(jwtToken);
      setUser(registeredUser);
      setAuthToken(jwtToken);
    } catch (error: any) {
      setAuthToken(null);
      throw new Error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      setAuthToken(null);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

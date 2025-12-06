import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserInfo } from '../../shared/types/auth';
import type { LoginRequest } from '../../features/auth/model';
import { authUsecase } from '../../features/auth/usecase';
import { saveTokens, clearTokens, getAccessToken, getRefreshToken } from '../../shared/utils/token';

interface AuthContextValue {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    const refreshToken = getRefreshToken();

    if (token && refreshToken) {
      setUser({
        id: '',
        username: 'unknown',
        fullName: 'Đã đăng nhập',
        roles: [],
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const res = await authUsecase.login(data);
      saveTokens(res.tokens.accessToken, res.tokens.refreshToken);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

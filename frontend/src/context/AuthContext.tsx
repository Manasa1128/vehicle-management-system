import { useState, type ReactNode } from "react";

import type {
  User,
  LoginData,
  RegisterData,
} from "../types/auth.types";

import {
  loginUser,
  registerUser,
} from "../services/auth.service";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser) as User;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const loading = false;

  // ==================== LOGIN ====================

  const login = async (data: LoginData): Promise<void> => {
    const response = await loginUser(data);

    localStorage.setItem("token", response.token);

    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );

    setToken(response.token);
    setUser(response.user);
  };

  // ==================== REGISTER ====================

  const register = async (
    data: RegisterData
  ): Promise<void> => {
    const response = await registerUser(data);

    localStorage.setItem("token", response.token);

    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );

    setToken(response.token);
    setUser(response.user);
  };

  // ==================== LOGOUT ====================

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // ==================== AUTH STATUS ====================

  const isAuthenticated = Boolean(token && user);

  const isAdmin = user?.role === "ADMIN";

  // ==================== PROVIDER ====================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
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


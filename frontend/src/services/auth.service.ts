import api from "./api";

import type {
  LoginData,
  RegisterData,
  AuthResponse,
} from "../types/auth.types";

// ==================== REGISTER ====================

export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data
  );

  return response.data;
};

// ==================== LOGIN ====================

export const loginUser = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
};
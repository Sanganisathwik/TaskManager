// src/services/authService.ts
import api from './api';

export interface LoginResponse {
  token: string;
}

export async function registerUser(email: string, password: string): Promise<{ success: boolean }>{
  const { data } = await api.post('/auth/register', { email, password });
  return data;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

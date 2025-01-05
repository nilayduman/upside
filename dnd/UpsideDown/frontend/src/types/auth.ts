export interface AuthUser {
  id: string;
  email: string | null | undefined;
  name?: string | null;
  photo?: string | null;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
} 
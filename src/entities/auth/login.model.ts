import type { AuthTokens, UserInfo } from '../../shared/types/auth';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResult {
  tokens: AuthTokens;
  user: UserInfo;
}

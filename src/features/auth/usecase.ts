import { LoginRequest, LoginResult } from '@/entities/auth/login.model';
import { authService } from '../../services/auth.service';

export const authUsecase = {
  login: (payload: LoginRequest): Promise<LoginResult> => authService.login(payload),
};

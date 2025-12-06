import { LoginRequest as LoginRequestModel, LoginResult } from '@/entities/auth/login.model';
import { LoginRequest as LoginRequestApi } from '@/entities/auth/auth.types';
import { authService } from '../../services/auth.service';

export const authUsecase = {
  login: async (payload: LoginRequestModel): Promise<LoginResult> => {
    // Convert the model format to API format
    const apiPayload: LoginRequestApi = {
      user_name: payload.username,
      password: payload.password,
    };

    const response = await authService.login(apiPayload);

    if (!response.is_succeeded || !response.data) {
      throw new Error(response.message || 'Login failed');
    }

    return {
      tokens: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      },
      user: {
        id: response.data.user_id,
        username: response.data.user_id, // Use user_id as username if not provided
        fullName: response.data.full_name,
        roles: [],
      },
    };
  },
};

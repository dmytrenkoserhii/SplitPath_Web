import { XiorResponse } from 'xior';
import { SignUpDataType, SignInFormSchemaType } from '@/schemas/auth';
import { xiorClient } from '@/lib';
import { User } from '@/types/user';

interface AuthApi {
  signUp: (data: SignUpDataType) => Promise<XiorResponse<User>>;
  signIn: (data: SignInFormSchemaType) => Promise<XiorResponse<User>>;
  logout: (headers?: Headers) => Promise<XiorResponse<void>>;
  verifyAccessToken: (headers?: Headers) => Promise<XiorResponse<User>>;
  refreshAccessToken: (headers?: Headers) => Promise<XiorResponse<void>>;
}

export const authService = (): AuthApi => {
  return {
    signUp,
    signIn,
    logout,
    verifyAccessToken,
    refreshAccessToken,
  };
};

const signUp = (data: SignUpDataType) => {
  return xiorClient.post<User>(`auth/sign-up`, {
    email: data.email,
    password: data.password,
    username: data.username,
  });
};

const signIn = (data: SignInFormSchemaType) => {
  return xiorClient.post<User>(`auth/sign-in`, {
    email: data.email,
    password: data.password,
  });
};

const logout = (headers?: Headers) => {
  return xiorClient.get<void>(`auth/logout`, { headers });
};

// TODO: Rename/Change this. Either we use /users/current or we create another endpoint
const verifyAccessToken = (headers?: Headers) => {
  return xiorClient.get<User>(`users/current`, { headers });
};

const refreshAccessToken = (headers?: Headers) => {
  return xiorClient.get<void>(`auth/refresh`, { headers });
};

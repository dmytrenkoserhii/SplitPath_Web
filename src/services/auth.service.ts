import { XiorResponse } from 'xior';
import { SignUpDataType, SignInFormSchemaType } from '@/schemas/auth';
import { xiorClient } from '@/lib';
import { User } from '@/types/user';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing environment variable: BACKEND_URL');
}

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
  return xiorClient.post<User>(`${BACKEND_URL}/auth/register`, {
    email: data.email,
    password: data.password,
    username: data.username,
  });
};

const signIn = (data: SignInFormSchemaType) => {
  return xiorClient.post<User>(`${BACKEND_URL}/auth/sign-in`, {
    email: data.email,
    password: data.password,
  });
};

const logout = (headers?: Headers) => {
  return xiorClient.get<void>(`${BACKEND_URL}/auth/logout`, { headers });
};

// TODO: Rename/Change this. Either we use /users/current or we create another endpoint
const verifyAccessToken = (headers?: Headers) => {
  return xiorClient.get<User>(`${BACKEND_URL}/users/current`, { headers });
};

const refreshAccessToken = (headers?: Headers) => {
  return xiorClient.get<void>(`${BACKEND_URL}/auth/refresh`, { headers });
};

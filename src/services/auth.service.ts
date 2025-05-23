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
  googleAuth: () => void;
  verifyEmail: (token: string) => Promise<XiorResponse<void>>;
  resendVerificationEmail: () => Promise<XiorResponse<void>>;
  forgotPassword: (email: string) => Promise<XiorResponse<void>>;
  resetPassword: (token: string, password: string) => Promise<XiorResponse<void>>;
}

export const authService = (): AuthApi => {
  return {
    signUp,
    signIn,
    logout,
    verifyAccessToken,
    refreshAccessToken,
    googleAuth,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
  };
};

const signUp = (data: SignUpDataType) => {
  return xiorClient.post<User>(`auth/sign-up`, {
    email: data.email,
    password: data.password,
    username: data.username,
  });
};

const googleAuth = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
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

const verifyEmail = (token: string) => {
  console.log('Attempting to verify email with token:', token);
  console.log('Full URL being called:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-email`);
  return xiorClient.post<void>(`users/verify-email`, { token });
};

const resendVerificationEmail = () => {
  return xiorClient.get<void>('users/resend-verification');
};

const forgotPassword = (email: string) => {
  console.log('Attempting to send forgot password email:', email);
  return xiorClient.post<void>(`auth/forgot-password`, { email });
};

const resetPassword = (token: string, password: string) => {
  console.log('Attempting to reset password with token:', token);
  return xiorClient.post<void>(`auth/reset-password`, { 
    token,
    password 
  });
};
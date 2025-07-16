import { XiorResponse } from 'xior';

import { xiorClient } from '@/lib';
import { User } from '@/types/user';

interface UsersApi {
  findAll: () => Promise<XiorResponse<User[]>>;
  getCurrent: () => Promise<XiorResponse<User>>;
  findOneById: (id: number) => Promise<XiorResponse<User>>;
  findOneByEmail: (email: string) => Promise<XiorResponse<User | null>>;
  deleteById: (id: number) => Promise<XiorResponse<{ deleted: boolean }>>;
  verifyEmail: (token: string) => Promise<XiorResponse<void>>;
  resendVerificationEmail: () => Promise<XiorResponse<void>>;
}

export const usersService = (): UsersApi => {
  return {
    findAll,
    getCurrent,
    findOneById,
    findOneByEmail,
    deleteById,
    verifyEmail,
    resendVerificationEmail,
  };
};

const findAll = () => {
  return xiorClient.get<User[]>('users');
};

const getCurrent = () => {
  return xiorClient.get<User>('users/current');
};

const findOneById = (id: number) => {
  return xiorClient.get<User>(`users/${id}`);
};

const findOneByEmail = (email: string) => {
  return xiorClient.get<User | null>(`users/email/${email}`);
};

const deleteById = (id: number) => {
  return xiorClient.delete<{ deleted: boolean }>(`users/${id}`);
};

const verifyEmail = (token: string) => {
  return xiorClient.post<void>(`users/verify-email`, { token });
};

const resendVerificationEmail = () => {
  return xiorClient.get<void>('users/resend-verification');
};

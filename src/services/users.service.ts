import { XiorResponse } from 'xior';
import { xiorClient } from '@/lib';
import { User } from '@/types/user';

interface UsersApi {
  findAll: () => Promise<XiorResponse<User[]>>;
  getCurrent: () => Promise<XiorResponse<User>>;
  findOneById: (id: number) => Promise<XiorResponse<User>>;
  findOneByEmail: (email: string) => Promise<XiorResponse<User | null>>;
  deleteById: (id: number) => Promise<XiorResponse<{ deleted: boolean }>>;
}

export const usersService = (): UsersApi => {
  return {
    findAll,
    getCurrent,
    findOneById,
    findOneByEmail,
    deleteById,
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

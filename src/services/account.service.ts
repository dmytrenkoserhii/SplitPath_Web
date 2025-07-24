import { xiorClient, xiorClientApi } from '@/lib';
import { Account } from '@/types/user';

interface UpdateAccountData {
  username?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  bio?: string;
}

interface AccountsApi {
  getCurrent: () => Promise<Account>;
  apiRouteUpdate: (data: UpdateAccountData) => Promise<Account>;
  update: (data: UpdateAccountData, headers: Record<string, string>) => Promise<Account>;
}

export const accountsService = (): AccountsApi => {
  return {
    getCurrent,
    apiRouteUpdate,
    update,
  };
};

const getCurrent = async () => {
  const response = await xiorClient.get<Account>('account');
  return response.data;
};

const apiRouteUpdate = async (data: UpdateAccountData) => {
  const response = await xiorClientApi.patch<Account>('/api/account', data);
  return response.data;
};

const update = async (data: UpdateAccountData, headers: Record<string, string>) => {
  const response = await xiorClient.patch<Account>('account', data, { headers });
  return response.data;
};

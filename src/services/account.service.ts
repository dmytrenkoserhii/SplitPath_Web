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
  updateViaApiRoute: (data: UpdateAccountData) => Promise<Account>;
  updateViaBackend: (data: UpdateAccountData, headers: Record<string, string>) => Promise<Account>;
}

export const accountsService = (): AccountsApi => {
  return {
    getCurrent,
    updateViaApiRoute,
    updateViaBackend,
  };
};

const getCurrent = async () => {
  const response = await xiorClient.get<Account>('account');
  return response.data;
};

const updateViaApiRoute = async (data: UpdateAccountData) => {
  const response = await xiorClientApi.patch<Account>('/api/account', data);
  return response.data;
};

const updateViaBackend = async (data: UpdateAccountData, headers: Record<string, string>) => {
  const response = await xiorClient.patch<Account>('account', data, { headers });
  return response.data;
};

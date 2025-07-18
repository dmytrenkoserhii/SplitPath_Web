import { XiorResponse } from 'xior';

import { xiorClient } from '@/lib';
import { Account } from '@/types/user';

interface UpdateAccountData {
  username?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  bio?: string;
}

interface AccountsApi {
  getCurrent: () => Promise<XiorResponse<Account>>;
  update: (data: UpdateAccountData) => Promise<XiorResponse<Account>>;
}

export const accountsService = (): AccountsApi => {
  return {
    getCurrent,
    update,
  };
};

const getCurrent = () => {
  return xiorClient.get<Account>('account');
};

const update = (data: UpdateAccountData) => {
  return xiorClient.patch<Account>('account', data);
};

import { Role } from '@/enums';
import { Story } from '@/types/story';

import { Account } from './account.interface';

export interface User {
  id: number;
  email: string;
  hashedPassword: string | null;
  role: Role;
  refreshToken: string | null;
  isEmailVerified: boolean;
  isPremium: boolean;
  isOnline?: boolean;
  createdAt: Date;
  updatedAt: Date;
  stories: Story[];
  account: Account;
}

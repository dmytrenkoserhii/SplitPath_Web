import { Role } from '@/enums';
import { Account } from './account.interface';
import { Story } from '@/types/story';

export interface User {
  id: number;
  email: string;
  hashedPassword: string | null;
  role: Role;
  refreshToken: string | null;
  isEmailVerified: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  stories: Story[];
  account: Account;
}

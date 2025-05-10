import { User } from './user.interface';

export interface Account {
  id: number;
  username: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

import { User } from './user.interface';

export interface Account {
  id: number;
  username: string;
  avatarUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: Date | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

import { User } from '../user';

export interface PrivateMessage {
  id: number;
  from: User;
  to: User;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

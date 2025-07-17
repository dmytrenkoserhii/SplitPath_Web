import { User } from '../user';

export interface GlobalMessage {
  id: number;
  from: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

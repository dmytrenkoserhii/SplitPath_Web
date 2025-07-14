import { User } from '../user';

export interface PublicMessage {
  id: number;
  from: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

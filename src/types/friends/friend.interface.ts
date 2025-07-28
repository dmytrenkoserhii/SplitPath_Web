import { FriendStatus } from '@/enums/friend-status.enum';
import { User } from '@/types/user/user.interface';

export interface Friend {
  id: number;
  sender: User;
  receiver: User;
  status: FriendStatus;
  createdAt: Date;
  updatedAt: Date;
}

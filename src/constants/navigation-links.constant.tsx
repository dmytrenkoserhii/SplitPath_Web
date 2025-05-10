import { NavigationLink } from '@/types/shared';
import { User, MessageCircle } from 'lucide-react';

export const NAVIGATION_LINKS: NavigationLink[] = [
  {
    label: 'Friends',
    href: '/friends',
    icon: <User />,
  },
  {
    label: 'Chats',
    href: '/chats',
    icon: <MessageCircle />,
  },
];

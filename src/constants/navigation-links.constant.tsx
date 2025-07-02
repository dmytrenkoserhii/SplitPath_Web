import { Book, BookOpen, History, MessageCircle, User } from 'lucide-react';

import { NavigationLink } from '@/types/shared';

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
  {
    label: 'Stories',
    href: '/stories/selection',
    icon: <Book />,
  },
  {
    label: 'History',
    href: '/stories/history',
    icon: <History />,
  },
  {
    label: 'Active',
    href: '/stories',
    icon: <BookOpen />,
  },
];

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
    icon: <Book />,
    sublinks: [
      {
        label: 'New Story',
        href: '/stories/selection',
        icon: <Book />,
        description: 'Select a new story to begin.',
      },
      {
        label: 'Active',
        href: '/stories',
        icon: <BookOpen />,
        description: 'View your currently active stories.',
      },
      {
        label: 'History',
        href: '/stories/history',
        icon: <History />,
        description: 'Review your past adventures.',
      },
    ],
  },
];

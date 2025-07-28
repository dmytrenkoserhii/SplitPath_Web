'use client';

import { usePathname } from 'next/navigation';

import { Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { useQuery } from '@tanstack/react-query';

import { EmailVerificationAlert, LogoutButton } from '@/components/auth';
import { NAVIGATION_LINKS } from '@/constants';
import { FriendRequestDirection, FriendStatus, ReactQueryTags } from '@/enums';
import { useNavbarState } from '@/hooks';
import { chatsService, friendsService } from '@/services';
import { User } from '@/types/user';

import { NavbarItem } from './navbar/navbar-item';

interface NavbarProps {
  user: User;
}

// I don't use AppShell.Navbar because I don't see how it should be used
// with Next. We need to pass a 'open' value to the collapsed prop. in AppShell.
// But AppShell is located in the layout.tsx file, and layout.tsx is server component.
export const Navbar = ({ user }: NavbarProps) => {
  const { isNavbarOpen } = useNavbarState();
  const isMobile = useMediaQuery('(max-width: 48rem)');
  const pathname = usePathname();

  const showNavbar = isMobile ? isNavbarOpen : false;

  const { data: chatsPreviews } = useQuery({
    queryKey: [ReactQueryTags.CHAT_PREVIEWS],
    queryFn: () => chatsService().getChatPreviews(),
  });

  const { data: friendsRequestsIncoming } = useQuery({
    queryKey: [ReactQueryTags.FRIEND_REQUESTS_INCOMING],
    queryFn: () =>
      friendsService().getFriendRequests({
        status: FriendStatus.PENDING,
        direction: FriendRequestDirection.INCOMING,
        page: 1,
        limit: 1000,
      }),
  });

  const totalUnreadMessages = chatsPreviews?.reduce(
    (acc, chat) => acc + (chat.unreadCount > 0 ? 1 : 0),
    0,
  );
  const totalFriendRequestsIncoming = friendsRequestsIncoming?.data.items.length;

  return (
    <div
      style={{
        padding: '1rem',
        display: showNavbar ? 'block' : 'none',
        position: 'fixed',
        top: 60,
        left: 0,
        width: '100%',
        height: 'calc(100dvh - 60px - 60px)',
        background: 'var(--mantine-color-body)',
        zIndex: 100000,
      }}
    >
      <Stack justify="space-between" h="100%">
        <Stack>
          {user && !user.isEmailVerified && <EmailVerificationAlert />}
          {NAVIGATION_LINKS.map((link) => {
            link.isActive = pathname === link.href;
            if (link.href === '/chats') {
              link.badgeContent = totalUnreadMessages;
            } else if (link.href === '/friends') {
              link.badgeContent = totalFriendRequestsIncoming;
            }

            return <NavbarItem key={link.label} link={link} pathname={pathname} />;
          })}
        </Stack>
        <Stack>
          <LogoutButton />
        </Stack>
      </Stack>
    </div>
  );
};

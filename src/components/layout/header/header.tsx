'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Anchor, AppShell, Box, Burger, Button, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { useQuery } from '@tanstack/react-query';

import { NAVIGATION_LINKS } from '@/constants';
import { FriendRequestDirection, FriendStatus, ReactQueryTags } from '@/enums';
import { useNavbarState } from '@/hooks';
import { chatsService, friendsService } from '@/services';
import { User } from '@/types/user';

import { EmailVerificationAlert, LogoutButton } from '../../auth';
import { ThemeToggle } from '../../ui';
import { HeaderItem } from './header-item';

interface HeaderProps {
  user: User;
}

export const Header = ({ user }: HeaderProps) => {
  const { isNavbarOpen, setNavbarOpen } = useNavbarState();
  const isMobile = useMediaQuery('(max-width: 48rem)');
  const pathname = usePathname();

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

  const handleBurgerClick = () => {
    setNavbarOpen(!isNavbarOpen);
  };

  const totalUnreadMessages = chatsPreviews?.reduce(
    (acc, chat) => acc + (chat.unreadCount > 0 ? 1 : 0),
    0,
  );
  const totalFriendRequestsIncoming = friendsRequestsIncoming?.data.items.length;

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={isNavbarOpen} onClick={handleBurgerClick} hiddenFrom="sm" size="sm" />
          <Anchor
            component={Link}
            href="/stories/selection"
            prefetch={false}
            style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
            c="primary"
          >
            <img src="/splitpath-logo.svg" alt="logo" height={32} />
          </Anchor>
        </Group>

        <Group gap="md" flex={1} justify="center" style={{ display: isMobile ? 'none' : 'flex' }}>
          {NAVIGATION_LINKS.map((link) => {
            link.isActive = pathname === link.href;
            if (link.href === '/chats') {
              link.badgeContent = totalUnreadMessages;
            } else if (link.href === '/friends') {
              link.badgeContent = totalFriendRequestsIncoming;
            }

            return <HeaderItem key={link.label} link={link} pathname={pathname} />;
          })}
        </Group>

        <Group>
          {user && !user.isEmailVerified && (
            <EmailVerificationAlert w="auto" style={{ display: isMobile ? 'none' : 'flex' }} />
          )}
          <Box style={{ display: isMobile ? 'none' : 'flex' }}>
            {!user ? (
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            ) : (
              <LogoutButton />
            )}
          </Box>
          <ThemeToggle />
        </Group>
      </Group>
    </AppShell.Header>
  );
};

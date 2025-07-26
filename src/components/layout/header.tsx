'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  AppShell,
  Badge,
  Box,
  Burger,
  Button,
  Center,
  Group,
  HoverCard,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { useQuery } from '@tanstack/react-query';

import { ChevronDown } from 'lucide-react';

import { NAVIGATION_LINKS } from '@/constants';
import { FriendRequestDirection, FriendStatus, ReactQueryTags } from '@/enums';
import { useNavbarState } from '@/hooks';
import { chatsService, friendsService } from '@/services';
import { User } from '@/types/user';

import { EmailVerificationAlert, LogoutButton } from '../auth';
import { ThemeToggle } from '../ui';
import classes from './Header.module.css';

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
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>SplitPath</span>
        </Group>

        <Group gap="md" flex={1} justify="center" style={{ display: isMobile ? 'none' : 'flex' }}>
          {NAVIGATION_LINKS.map((link) => {
            if (link.sublinks) {
              const isGroupActive = link.sublinks.some((sub) => pathname.startsWith(sub.href!));
              return (
                <HoverCard
                  key={link.label}
                  width={300}
                  position="bottom"
                  radius="md"
                  shadow="md"
                  withinPortal
                >
                  <HoverCard.Target>
                    <a href="#" className={classes.link} data-active={isGroupActive || undefined}>
                      <Center inline>
                        <Box component="span" mr={5}>
                          {link.label}
                        </Box>
                        <ChevronDown style={{ width: '16px', height: '16px' }} />
                      </Center>
                    </a>
                  </HoverCard.Target>
                  <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                    <Stack gap="sm">
                      {link.sublinks.map((sublink) => {
                        const isSublinkActive = pathname === sublink.href;
                        return (
                          <UnstyledButton
                            component={Link}
                            href={sublink.href!}
                            key={sublink.label}
                            className={classes.subLink}
                            data-active={isSublinkActive || undefined}
                          >
                            <Group wrap="nowrap" align="center">
                              <Box mr="sm" pt="xs">
                                {sublink.icon}
                              </Box>
                              <div>
                                <Text size="sm" fw={500}>
                                  {sublink.label}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {sublink.description}
                                </Text>
                              </div>
                            </Group>
                          </UnstyledButton>
                        );
                      })}
                    </Stack>
                  </HoverCard.Dropdown>
                </HoverCard>
              );
            }

            if (!link.href) return null;

            const isActive = pathname === link.href;
            if (link.href === '/chats') {
              link.badgeContent = totalUnreadMessages;
            } else if (link.href === '/friends') {
              link.badgeContent = totalFriendRequestsIncoming;
            }

            const isBadgeVisible =
              link.badgeContent !== undefined &&
              link.badgeContent !== null &&
              link.badgeContent !== 0;
            return (
              <Link
                href={link.href}
                key={link.href}
                className={classes.link}
                data-active={isActive || undefined}
              >
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  {link.label}
                  {isBadgeVisible && (
                    <Badge
                      style={{ position: 'absolute', top: -15, right: -35 }}
                      variant="filled"
                      color="secondary"
                      radius="xl"
                    >
                      {link.badgeContent}
                    </Badge>
                  )}
                </span>
              </Link>
            );
          })}
        </Group>

        <Group style={{ display: isMobile ? 'none' : 'flex' }}>
          {user && !user.isEmailVerified && <EmailVerificationAlert w="auto" />}
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

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge, Box, NavLink, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { useQuery } from '@tanstack/react-query';

import { EmailVerificationAlert, LogoutButton } from '@/components/auth';
import { NAVIGATION_LINKS } from '@/constants';
import { FriendRequestDirection, FriendStatus, ReactQueryTags } from '@/enums';
import { useNavbarState } from '@/hooks';
import { chatsService, friendsService } from '@/services';
import { User } from '@/types/user';

import classes from './Header.module.css';

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
            if (link.sublinks) {
              const isGroupActive = link.sublinks.some((sub) => pathname.startsWith(sub.href!));
              return (
                <NavLink
                  key={link.label}
                  label={link.label}
                  leftSection={link.icon}
                  childrenOffset={28}
                  defaultOpened={isGroupActive}
                  classNames={{ root: classes.link }}
                  data-active={isGroupActive || undefined}
                >
                  {link.sublinks.map((sublink) => (
                    <NavLink
                      key={sublink.label}
                      component={Link}
                      href={sublink.href!}
                      label={sublink.label}
                      leftSection={sublink.icon}
                      active={pathname === sublink.href}
                      classNames={{ root: classes.link }}
                      styles={{
                        root: {
                          marginBottom: '1rem',
                          marginTop: '-0.5rem',
                        },
                      }}
                    />
                  ))}
                </NavLink>
              );
            }

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
              <NavLink
                key={link.label}
                component={Link}
                href={link.href!}
                label={link.label}
                leftSection={link.icon}
                active={pathname === link.href}
                classNames={{ root: classes.link }}
                rightSection={
                  isBadgeVisible ? (
                    <Badge size="sm" variant="filled" radius="xl" color="secondary">
                      {link.badgeContent}
                    </Badge>
                  ) : undefined
                }
              />
            );
          })}
        </Stack>
        <Stack>
          <LogoutButton />
        </Stack>
      </Stack>
    </div>
  );
};

'use client';

import Link from 'next/link';

import { Badge, NavLink } from '@mantine/core';

import { useNavbarState } from '@/hooks';
import { NavigationLink as NavigationLinkType } from '@/types/shared';

import classes from '../header/Header.module.css';

interface NavbarItemProps {
  link: NavigationLinkType;
  pathname: string;
}

export const NavbarItem = ({ link, pathname }: NavbarItemProps) => {
  const { setNavbarOpen } = useNavbarState();
  const handleClose = () => setNavbarOpen(false);

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
        {link.sublinks.map((sublink) => {
          const isSublinkActive = pathname === sublink.href;
          return (
            <NavLink
              prefetch={false}
              key={sublink.label}
              component={Link}
              href={sublink.href!}
              label={sublink.label}
              leftSection={sublink.icon}
              active={isSublinkActive}
              classNames={{ root: classes.link }}
              data-active={isSublinkActive || undefined}
              styles={{
                root: {
                  marginBottom: '1rem',
                  marginTop: '-0.5rem',
                },
              }}
              onClick={handleClose}
            />
          );
        })}
      </NavLink>
    );
  }

  const isBadgeVisible =
    link.badgeContent !== undefined && link.badgeContent !== null && link.badgeContent !== 0;
  return (
    <NavLink
      key={link.label}
      prefetch={false}
      component={Link}
      href={link.href!}
      label={link.label}
      leftSection={link.icon}
      active={link.isActive}
      classNames={{ root: classes.link }}
      rightSection={
        isBadgeVisible ? (
          <Badge size="sm" variant="filled" radius="xl" color="secondary">
            {link.badgeContent}
          </Badge>
        ) : undefined
      }
      onClick={handleClose}
    />
  );
};

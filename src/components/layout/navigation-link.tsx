import Link from 'next/link';

import { Badge, NavLink } from '@mantine/core';

import { NavigationLink as NavigationLinkInterface } from '@/types/shared';

export const NavigationLink = ({ link }: { link: NavigationLinkInterface }) => {
  const isBadgeVisible =
    link.badgeContent !== undefined && link.badgeContent !== null && link.badgeContent !== 0;
  console.log(link.isActive);

  return (
    <span style={{ position: 'relative' }}>
      <NavLink
        component={Link}
        label={link.label}
        href={link.href}
        rightSection={link.icon}
        active={link.isActive}
        color="primary.3"
      />
      {isBadgeVisible && (
        <Badge
          style={{ position: 'absolute', top: 0, right: -10 }}
          variant="filled"
          color="secondary"
          radius="xl"
        >
          {link.badgeContent}
        </Badge>
      )}
    </span>
  );
};

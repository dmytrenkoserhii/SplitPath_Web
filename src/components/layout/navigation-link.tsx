import Link from 'next/link';

import { NavLink } from '@mantine/core';

import { NavigationLink as NavigationLinkInterface } from '@/types/shared';

export const NavigationLink = ({ link }: { link: NavigationLinkInterface }) => {
  return (
    <span>
      <NavLink component={Link} label={link.label} href={link.href} leftSection={link.icon} />
    </span>
  );
};

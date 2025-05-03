import { NavigationLink as NavigationLinkInterface } from '@/interfaces';
import { NavLink } from '@mantine/core';
import Link from 'next/link';

export const NavigationLink = ({ link }: { link: NavigationLinkInterface }) => {
  return <NavLink component={Link} label={link.label} href={link.href} />;
};

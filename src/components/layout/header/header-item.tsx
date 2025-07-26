'use client';

import Link from 'next/link';

import { Badge, Box, Center, Group, HoverCard, Stack, Text, UnstyledButton } from '@mantine/core';

import { ChevronDown } from 'lucide-react';

import { NavigationLink as NavigationLinkType } from '@/types/shared';

import classes from './Header.module.css';

interface HeaderItemProps {
  link: NavigationLinkType;
  pathname: string;
}

export const HeaderItem = ({ link, pathname }: HeaderItemProps) => {
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
                  prefetch={false}
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

  const isBadgeVisible =
    link.badgeContent !== undefined && link.badgeContent !== null && link.badgeContent !== 0;
  return (
    <Link
      href={link.href}
      key={link.href}
      prefetch={false}
      className={classes.link}
      data-active={link.isActive || undefined}
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
};

import Link from 'next/link';

import { Anchor, Badge, Box, Card, Text, Title } from '@mantine/core';

import { StoryStatus } from '@/enums';
import { Story } from '@/types/story';

import styles from './story-card.module.css';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  let badgeColor = 'secondary';

  if (story.status === StoryStatus.FINISHED) {
    badgeColor = 'primary';
  }
  if (story.status === StoryStatus.IN_PROGRESS) {
    badgeColor = 'tertiary';
  }

  return (
    <Anchor component={Link} underline="never" href={`/stories/${story.id}`}>
      <Card shadow="sm" padding="lg" radius="md" withBorder h={280} className={styles.card}>
        <Box className={styles.content}>
          <Box className={styles.header}>
            <Title order={3} className={styles.title}>
              {story.title}
            </Title>
            <Badge variant="light" color={badgeColor}>
              {story.status}
            </Badge>
          </Box>
          <Text size="sm" c="dimmed" mb="md">
            Topic: {story.storyTopic.name}
          </Text>
          <Text size="sm" c="dimmed" className={styles.segments}>
            {story.segments?.[0]?.text || 'No segments yet'}
          </Text>
        </Box>
      </Card>
    </Anchor>
  );
}

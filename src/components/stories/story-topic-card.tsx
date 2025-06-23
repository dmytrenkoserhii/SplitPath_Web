import Link from 'next/link';

import { Anchor, Box, Card, Text, Title } from '@mantine/core';

import { StoryTopic } from '@/types/story';

import { CreateStoryButton } from './create-story-button';
import styles from './story-topic-card.module.css';

export const StoryTopicCard = ({ topic }: { topic: StoryTopic }) => {
  return (
    <Anchor component={Link} underline="never" href={`/stories/${topic.id}`}>
      <Card shadow="sm" padding="lg" radius="md" withBorder h={280} className={styles.card}>
        <Box className={styles.content}>
          <Title order={1} mb="md" className={styles.title}>
            {topic.name}
          </Title>

          <Text size="md" c="dimmed" fw={500} className={styles.description}>
            {topic.description}
          </Text>
        </Box>
        <CreateStoryButton topic={topic} />
      </Card>
    </Anchor>
  );
};

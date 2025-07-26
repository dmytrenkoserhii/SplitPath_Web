import { Box, Card, Text, Title } from '@mantine/core';

import { StoryTopic } from '@/types/story';

import { CreateStoryButton } from './create-story-button';
import styles from './story-topic-card.module.css';

export const StoryTopicCard = ({ topic }: { topic: StoryTopic }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h={280} className={styles.card}>
      <Box
        h="100%"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <Box className={styles.content}>
          <Title order={1} mb="md" className={styles.title}>
            {topic.name}
          </Title>

          <Text size="md" c="dimmed" fw={500} lineClamp={5} className={styles.description}>
            {topic.description}
          </Text>
        </Box>
        <CreateStoryButton topic={topic} />
      </Box>
    </Card>
  );
};

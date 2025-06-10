'use client';

import { Card, Box, Title, Text, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { StoryTopic } from '@/types/story';
import { storiesService } from '@/services/stories.service';
import { usersService } from '@/services/users.service';
import { ReactQueryTags } from '@/enums';
import { User } from '@/types/user';
import styles from './story-topic-card.module.css';

interface StoryTopicCardProps {
  topic: StoryTopic;
}

export function StoryTopicCard({ topic }: StoryTopicCardProps) {
  const router = useRouter();

  const { data: currentUser } = useQuery<User>({
    queryKey: [ReactQueryTags.USER],
    queryFn: () =>
      usersService()
        .getCurrent()
        .then((res) => res.data),
  });

  const { mutate: startStory, isPending } = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const storyTitle = `${topic.name} Adventure`;
      
      const storyResponse = await storiesService().create({
        title: storyTitle,
        topicId: topic.id,
      });
      
      return storyResponse.data;
    },
    onSuccess: (story) => {
      notifications.show({
        title: 'Starting Your Adventure',
        message: 'Preparing your story...',
        color: 'green',
      });
      router.push(`/stories/${story.id}?segment=1`);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create story. Please try again.',
        color: 'red',
      });
    },
  });

  const isDisabled = !currentUser || isPending;

  return (
    <Card 
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      h={280}
      className={styles.card}
      onClick={() => !isDisabled && startStory()}
      style={{ 
        cursor: isDisabled ? 'default' : 'pointer',
        opacity: isDisabled ? 0.7 : 1 
      }}
    >
      <Box className={styles.content}>
        <Title order={3} mb="md" className={styles.title}>{topic.name}</Title>
        <Text 
          size="sm" 
          c="dimmed" 
          className={styles.description}
        >
          {topic.description}
        </Text>
        <Button
          variant="light"
          color="orange"
          fullWidth
          mt="auto"
          loading={isPending}
          disabled={!currentUser}
          className={styles.button}
        >
          {isPending ? 'Creating Story...' : !currentUser ? 'Loading...' : 'Start Adventure'}
        </Button>
      </Box>
    </Card>
  );
} 
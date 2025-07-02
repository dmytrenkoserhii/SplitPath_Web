'use client';

import { Box, Button, Card, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { storyTopicsService } from '@/services/story-topics.service';
import { StoryTopic } from '@/types/story/story-topic.interface';

import styles from './topic-card.module.css';
import { UpdateTopicForm } from './update-topic-form';

export const TopicCard = ({ topic }: { topic: StoryTopic }) => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  const { mutate: deleteTopic } = useMutation({
    mutationFn: (id: number) => storyTopicsService().deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-topics'] });
      notifications.show({
        title: 'Topic deleted',
        message: 'Topic has been deleted',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete topic',
        color: 'red',
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteTopic(id);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.card} onClick={open}>
        <Box className={styles.content}>
          <Title order={3} mb="md" className={styles.title}>
            {topic.name}
          </Title>

          <Text size="sm" c="dimmed" fw={500} className={styles.description}>
            {topic.description}
          </Text>
        </Box>
        <Button
          variant="outline"
          color="red"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(topic.id);
          }}
        >
          Delete
        </Button>
      </Card>

      <UpdateTopicForm topic={topic} opened={opened} onClose={close} />
    </>
  );
};

'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useMutation } from '@tanstack/react-query';

import { storiesService } from '@/services/stories.service';
import { StoryTopic } from '@/types/story/story-topic.interface';

interface CreateStoryButtonProps {
  topic: StoryTopic;
}

export const CreateStoryButton = ({ topic }: CreateStoryButtonProps) => {
  const router = useRouter();

  const { mutate: startStory, isPending } = useMutation({
    mutationFn: async () => {
      const storyTitle = `${topic.name} Adventure`;

      return await storiesService().create({
        title: storyTitle,
        topicId: topic.id,
      });
    },
    onSuccess: (story) => {
      notifications.show({
        title: 'Starting Your Adventure',
        message: 'Preparing your story...',
        color: 'green',
      });
      router.push(`/stories/${story.id}`);
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create story. Please try again.',
        color: 'red',
      });
    },
  });

  return (
    <Button onClick={() => startStory()} loading={isPending} fullWidth h={50} mih={50} size="lg">
      Start Adventure
    </Button>
  );
};

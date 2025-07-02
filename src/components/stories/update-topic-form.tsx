'use client';

import { Button, Modal, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateTopicSchema, CreateTopicSchemaType } from '@/schemas/stories';
import { storyTopicsService } from '@/services/story-topics.service';
import { StoryTopic } from '@/types/story/story-topic.interface';

interface UpdateTopicFormProps {
  topic: StoryTopic;
  opened: boolean;
  onClose: () => void;
}

export const UpdateTopicForm = ({ topic, opened, onClose }: UpdateTopicFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<CreateTopicSchemaType>({
    validate: zodResolver(CreateTopicSchema),
    initialValues: {
      name: topic.name,
      description: topic.description || '',
    },
  });

  const { mutate: updateTopic, isPending } = useMutation({
    mutationFn: async (values: CreateTopicSchemaType) => {
      return await storyTopicsService().update(topic.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-topics'] });
      notifications.show({
        title: 'Topic updated',
        message: 'Topic updated successfully',
        color: 'green',
      });

      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    updateTopic(values);
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Topic">
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            required
            label="Name"
            placeholder="Enter topic name"
            {...form.getInputProps('name')}
          />

          <Textarea
            required
            label="Description"
            placeholder="Enter topic description"
            minRows={3}
            {...form.getInputProps('description')}
          />

          <Button type="submit" color="tertiary" loading={isPending} disabled={!form.isValid()}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

'use client';

import { Button, Modal, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateTopicSchema, CreateTopicSchemaType } from '@/schemas/stories';
import { storyTopicsService } from '@/services/story-topics.service';

export const CreateTopicForm = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const form = useForm<CreateTopicSchemaType>({
    validate: zodResolver(CreateTopicSchema),
    initialValues: {
      name: '',
      description: '',
    },
  });

  const { mutate: createTopic, isPending } = useMutation({
    mutationFn: async (values: CreateTopicSchemaType) => {
      return await storyTopicsService().create(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-topics'] });
      notifications.show({
        title: 'Topic created',
        message: 'Topic created successfully',
        color: 'green',
      });
      close();
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
    createTopic(values);
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create New Story Topic">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              required
              label="Topic Name"
              placeholder="e.g., Medieval Fantasy, Space Adventure, Detective Mystery"
              {...form.getInputProps('name')}
            />

            <Textarea
              required
              label="Story Generation Guide"
              placeholder="Describe the theme, setting, and elements you want AI to use when generating stories. This description guides the AI in creating unique narratives, characters, and plot elements."
              minRows={3}
              {...form.getInputProps('description')}
            />

            <Button type="submit" color="tertiary" loading={isPending} disabled={!form.isValid()}>
              Create Topic
            </Button>
          </Stack>
        </form>
      </Modal>

      <Button onClick={open}>Create Topic</Button>
    </>
  );
};

'use client';

import { useRouter } from 'next/navigation';

import { Button, Modal, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { useMutation } from '@tanstack/react-query';

import { CreateTopicSchema, CreateTopicSchemaType } from '@/schemas/stories';
import { storyTopicsService } from '@/services/story-topics.service';

export const CreateTopicForm = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

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
      router.refresh();
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
      <Modal opened={opened} onClose={close} title="Authentication">
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

            <Button type="submit" color="orange" loading={isPending} disabled={!form.isValid()}>
              Create Topic
            </Button>
          </Stack>
        </form>
      </Modal>

      <Button onClick={open}>Create Topic</Button>
    </>
  );
};

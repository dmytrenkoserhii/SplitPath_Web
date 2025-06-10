'use client';

import { TextInput, Textarea, Button, Stack, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { storyTopicsService } from '@/services/story-topics.service';
import { CreateTopicSchema, CreateTopicSchemaType } from '@/schemas/stories/create-topic-form.schema';

export function CreateTopicForm() {
  const form = useForm<CreateTopicSchemaType>({
    validate: zodResolver(CreateTopicSchema),
    initialValues: {
      name: '',
      description: ''
    }
  });

  const { mutate: createTopic, isPending, isSuccess } = useMutation({
    mutationFn: async (values: CreateTopicSchemaType) => {
      const response = await storyTopicsService().create(values);
      return response.data;
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Topic created successfully',
        color: 'green'
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create topic. Please try again.',
        color: 'red'
      });
    }
  });

  const handleSubmit = form.onSubmit((values) => {
    createTopic(values);
  });

  if (isSuccess) {
    return (
      <Stack gap="md">
        <Text ta="center" c="green">
          Topic created successfully!
        </Text>
        <Text ta="center">
          You can now create a story in the story selection page.
        </Text>
      </Stack>
    );
  }

  return (
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

        <Button 
          type="submit" 
          color="orange"
          loading={isPending}
          disabled={!form.isValid()}
        >
          Create Topic
        </Button>
      </Stack>
    </form>
  );
} 
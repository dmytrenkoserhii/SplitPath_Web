'use client';

import React from 'react';

import { ActionIcon, Group, Paper, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';

import { useMutation } from '@tanstack/react-query';

import { Send } from 'lucide-react';

import { CreateGlobalMessageSchema } from '@/schemas/global-chat';
import { globalChatService } from '@/services';
import { CreateGlobalMessagePayload } from '@/types/global-chat';

interface GlobalChatInputProps {
  onMessageSent?: () => void;
}

export const GlobalChatInput = ({ onMessageSent }: GlobalChatInputProps) => {
  const form = useForm({
    initialValues: {
      content: '',
    },
    validate: zodResolver(CreateGlobalMessageSchema),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (newMessage: CreateGlobalMessagePayload) =>
      globalChatService().sendMessage(newMessage),
    onSuccess: () => {
      form.reset();
      onMessageSent?.();
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      content: values.content,
    });
  };

  return (
    <Paper p="xs" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group gap="xs">
          <TextInput
            placeholder="Type a message..."
            style={{ flex: 1 }}
            disabled={sendMessageMutation.isPending}
            autoComplete="off"
            {...form.getInputProps('content')}
          />
          <ActionIcon
            type="submit"
            radius="xl"
            variant="filled"
            color="secondary"
            size="lg"
            disabled={sendMessageMutation.isPending}
            loading={sendMessageMutation.isPending}
          >
            <Send size={18} />
          </ActionIcon>
        </Group>
      </form>
    </Paper>
  );
};

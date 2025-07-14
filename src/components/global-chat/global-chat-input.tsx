'use client';

import React from 'react';

import { ActionIcon, Group, Paper, TextInput } from '@mantine/core';

import { useMutation } from '@tanstack/react-query';

import { Send } from 'lucide-react';

import { globalChatService } from '@/services';
import { CreatePublicMessagePayload } from '@/types/global-chat';

interface GlobalChatInputProps {
  onMessageSent?: () => void;
}

export const GlobalChatInput = ({ onMessageSent }: GlobalChatInputProps) => {
  const [message, setMessage] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const sendMessageMutation = useMutation({
    mutationFn: (newMessage: CreatePublicMessagePayload) =>
      globalChatService().sendMessage(newMessage),
    onSuccess: () => {
      setMessage('');

      if (onMessageSent) {
        onMessageSent();
      }
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      content: trimmedMessage,
    });
  };

  return (
    <Paper p="xs" withBorder>
      <form onSubmit={handleSubmit}>
        <Group gap="xs">
          <TextInput
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            style={{ flex: 1 }}
            disabled={sendMessageMutation.isPending}
            autoComplete="off"
            ref={inputRef}
          />
          <ActionIcon
            type="submit"
            radius="xl"
            variant="filled"
            color="secondary"
            size="lg"
            disabled={!message.trim()}
            loading={sendMessageMutation.isPending}
          >
            <Send size={18} />
          </ActionIcon>
        </Group>
      </form>
    </Paper>
  );
};

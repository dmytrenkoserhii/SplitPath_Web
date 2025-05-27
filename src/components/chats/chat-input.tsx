'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TextInput, ActionIcon, Group, Paper } from '@mantine/core';
import { Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { chatsService } from '@/services/chats.service';
import { CreateMessagePayload, TypingStatusChangePayload } from '@/types/chats';
import { getPrivateChatsSocket } from '@/lib';
import { useDebouncedValue } from '@mantine/hooks';

interface ChatInputProps {
  receiverId: number;
  onMessageSent?: () => void;
}

export function ChatInput({ receiverId, onMessageSent }: ChatInputProps) {
  const [message, setMessage] = React.useState('');
  const [debouncedMessage] = useDebouncedValue(message, 300);
  const [isTyping, setIsTyping] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const privateChatsSocket = useMemo(() => getPrivateChatsSocket(), []);

  const sendMessageMutation = useMutation({
    mutationFn: (newMessage: CreateMessagePayload) =>
      chatsService().sendMessage(newMessage),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      content: trimmedMessage,
      toUserId: receiverId,
    });
  };

  useEffect(() => {
    if (debouncedMessage && !isTyping && isFocused) {
      privateChatsSocket.emit('typing_status_change', {
        receiverId: receiverId,
        isTyping: true,
      } as TypingStatusChangePayload);
      setIsTyping(true);
    } else if (!debouncedMessage && isTyping && isFocused) {
      privateChatsSocket.emit('typing_status_change', {
        receiverId: receiverId,
        isTyping: false,
      } as TypingStatusChangePayload);
      setIsTyping(false);
    } else if (!isFocused) {
      privateChatsSocket.emit('typing_status_change', {
        receiverId: receiverId,
        isTyping: false,
      } as TypingStatusChangePayload);
      setIsTyping(false);
    }
  }, [debouncedMessage, receiverId, privateChatsSocket, isTyping, isFocused]);

  useEffect(() => {
    return () => {
      if (isTyping) {
        privateChatsSocket.emit('typing_status_change', {
          receiverId: receiverId,
          isTyping: false,
        } as TypingStatusChangePayload);
      }
    };
  }, [isTyping, receiverId, privateChatsSocket]);

  useEffect(() => {
    if (message === '' && !sendMessageMutation.isPending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [message, sendMessageMutation.isPending]);

  return (
    <Paper p='xs' withBorder>
      <form onSubmit={handleSubmit}>
        <Group gap='xs'>
          <TextInput
            placeholder='Type a message...'
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            style={{ flex: 1 }}
            disabled={sendMessageMutation.isPending}
            autoComplete='off'
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={inputRef}
          />
          <ActionIcon
            type='submit'
            radius='xl'
            variant='filled'
            color='secondary'
            size='lg'
            disabled={!message.trim() || sendMessageMutation.isPending}
            loading={sendMessageMutation.isPending}
          >
            <Send size={18} />
          </ActionIcon>
        </Group>
      </form>
    </Paper>
  );
}

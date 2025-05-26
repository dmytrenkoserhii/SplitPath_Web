'use client';

import { PrivateMessage } from '@/types/chats';
import {
  ActionIcon,
  Box,
  Center,
  Paper,
  rem,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import React from 'react';
import { ChatMessagesListItem } from './chat-messages-list-item';
import { User } from '@/types/user';
import { ChevronDown } from 'lucide-react';

interface ChatMessagesListProps {
  messages: PrivateMessage[];
  currentUserId: number;
  friend: User;
  isFetchingNextPage: boolean;
  onScrollToTop: () => void;
}

export const ChatMessagesList = ({
  messages,
  currentUserId,
  friend,
  isFetchingNextPage,
  onScrollToTop,
}: ChatMessagesListProps) => {
  const initialScrollDone = React.useRef(false);
  const hasUserScrolled = React.useRef(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    React.useState(false);

  const prevScrollHeightRef = React.useRef(0);
  const prevScrollTopRef = React.useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (scrollAreaRef.current && messages.length > 0) {
      if (!initialScrollDone.current) {
        scrollToBottom();
        initialScrollDone.current = true;
      } else {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;

        if (isNearBottom) {
          scrollToBottom();
        }
      }
    }
    handleScroll();
  }, [messages]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;

      if (hasUserScrolled.current && scrollTop < 200 && !isFetchingNextPage) {
        onScrollToTop();
      }

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 200;
      setShowScrollToBottomButton(!isAtBottom && scrollHeight > clientHeight);

      if (isAtBottom && !hasUserScrolled.current) {
        hasUserScrolled.current = true;
      }
    }
  };

  return (
    <Paper w='100%' h='100%' withBorder>
      <Stack h='100%' p='sm' data-testid='chat-messages-list'>
        {!Boolean(messages.length) && (
          <Center h='100%'>
            <Title order={3}>
              Say hi to{' '}
              <span style={{ color: 'var(--mantine-color-secondary-6)' }}>
                {friend.account.username}
              </span>
            </Title>
          </Center>
        )}
        {Boolean(messages.length) && (
          <Box style={{ position: 'relative', height: '100%' }}>
            <ScrollArea
              scrollbarSize={3}
              scrollHideDelay={2000}
              h='100%'
              viewportRef={scrollAreaRef}
              onScrollPositionChange={handleScroll}
              style={{ pointerEvents: isFetchingNextPage ? 'none' : 'auto' }}
            >
              {messages.map((message) => (
                <ChatMessagesListItem
                  key={message.id}
                  message={message}
                  currentUserId={currentUserId}
                />
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {showScrollToBottomButton && (
              <ActionIcon
                variant='filled'
                size='xl'
                radius='xl'
                color='primary'
                onClick={scrollToBottom}
                style={{
                  position: 'absolute',
                  bottom: rem(20),
                  right: rem(20),
                  zIndex: 100000,
                }}
              >
                <ChevronDown style={{ width: rem(24), height: rem(24) }} />
              </ActionIcon>
            )}
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

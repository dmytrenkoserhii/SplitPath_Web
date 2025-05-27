'use client';

import { PrivateMessage } from '@/types/chats';
import {
  ActionIcon,
  Box,
  Center,
  LoadingOverlay,
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
import { useMarkMessagesAsRead } from '@/hooks';

interface ChatMessagesListProps {
  messages: PrivateMessage[];
  currentUserId: number;
  friend: User;
  onScrollToTop: () => void;
  isFetchingNextPage: boolean;
}

// TODO: I have a problem with scroll position when new messages are fetched
// It moves you down a bit when the new messages are fetched
export const ChatMessagesList = ({
  messages,
  currentUserId,
  friend,
  onScrollToTop,
  isFetchingNextPage,
}: ChatMessagesListProps) => {
  const { addMessageToMarkAsRead } = useMarkMessagesAsRead();

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
        if (isFetchingNextPage) {
          prevScrollHeightRef.current = scrollAreaRef.current.scrollHeight;
          prevScrollTopRef.current = scrollAreaRef.current.scrollTop;
        } else if (prevScrollHeightRef.current > 0 && messages.length > 0) {
          const newScrollHeight = scrollAreaRef.current.scrollHeight;
          const heightIncreasedBy =
            newScrollHeight - prevScrollHeightRef.current;

          scrollAreaRef.current.scrollTop =
            prevScrollTopRef.current + heightIncreasedBy;

          prevScrollHeightRef.current = 0;
          prevScrollTopRef.current = 0;
        } else {
          const { scrollTop, scrollHeight, clientHeight } =
            scrollAreaRef.current;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
          if (isNearBottom) {
            scrollToBottom();
          }
        }
      }
    }
  }, [messages, isFetchingNextPage]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;

      if (hasUserScrolled.current && scrollTop < 100 && !isFetchingNextPage) {
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
    <Paper w='100%' h='100%' withBorder style={{ position: 'relative' }}>
      <LoadingOverlay
        visible={isFetchingNextPage}
        zIndex={100001}
        overlayProps={{ radius: 'sm', blur: 1 }}
      />

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
                  addMessageToMarkAsRead={addMessageToMarkAsRead}
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

'use client';

import React from 'react';

import {
  ActionIcon,
  Box,
  Center,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Stack,
  Title,
  rem,
} from '@mantine/core';

import { ChevronDown } from 'lucide-react';

import { GlobalMessage } from '@/types/global-chat';

import { GlobalChatMessagesListItem } from './global-chat-messages-list-item';

interface GlobalChatMessagesListProps {
  messages: GlobalMessage[];
  currentUserId: number;
  onScrollToTop: () => void;
  isFetchingNextPage: boolean;
}

export const GlobalChatMessagesList = ({
  messages,
  currentUserId,
  onScrollToTop,
  isFetchingNextPage,
}: GlobalChatMessagesListProps) => {
  const initialScrollDone = React.useRef(false);
  const hasUserScrolled = React.useRef(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const [showScrollToBottomButton, setShowScrollToBottomButton] = React.useState(false);

  const prevScrollHeightRef = React.useRef(0);
  const prevScrollTopRef = React.useRef(0);

  const scrollToBottom = (behavior: 'smooth' | 'instant' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  React.useEffect(() => {
    if (!scrollAreaRef.current || messages.length === 0) return;

    const handleInitialScroll = () => {
      scrollToBottom('instant');
      initialScrollDone.current = true;
    };

    const handlePaginationScrollPreservation = () => {
      prevScrollHeightRef.current = scrollAreaRef.current!.scrollHeight;
      prevScrollTopRef.current = scrollAreaRef.current!.scrollTop;
    };

    const handlePostPaginationScrollAdjustment = () => {
      const newScrollHeight = scrollAreaRef.current!.scrollHeight;
      const heightIncreasedBy = newScrollHeight - prevScrollHeightRef.current;

      scrollAreaRef.current!.scrollTop = prevScrollTopRef.current + heightIncreasedBy;

      prevScrollHeightRef.current = 0;
      prevScrollTopRef.current = 0;
    };

    const handleAutoScrollForNewMessages = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current!;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;

      if (isNearBottom) {
        scrollToBottom();
      }
    };

    if (!initialScrollDone.current) {
      handleInitialScroll();
      return;
    }

    if (isFetchingNextPage) {
      handlePaginationScrollPreservation();
      return;
    }

    if (prevScrollHeightRef.current > 0) {
      handlePostPaginationScrollAdjustment();
      return;
    }

    handleAutoScrollForNewMessages();
  }, [messages, isFetchingNextPage]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;

      if (hasUserScrolled.current && scrollTop < 100 && !isFetchingNextPage) {
        onScrollToTop();
      }

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 200;
      setShowScrollToBottomButton(
        !isAtBottom && scrollHeight > clientHeight && hasUserScrolled.current,
      );

      if (isAtBottom && !hasUserScrolled.current) {
        hasUserScrolled.current = true;
      }
    }
  };

  return (
    <Paper w="100%" h={rem(600)} withBorder style={{ position: 'relative' }}>
      <LoadingOverlay
        visible={isFetchingNextPage}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
      />

      <Stack h="100%" p="sm" data-testid="global-chat-messages-list">
        {!Boolean(messages.length) && (
          <Center h="100%">
            <Title order={3}>Say howdy to these folks</Title>
          </Center>
        )}
        {Boolean(messages.length) && (
          <Box style={{ position: 'relative', height: '100%' }}>
            <ScrollArea
              scrollbarSize={3}
              scrollHideDelay={2000}
              h="100%"
              viewportRef={scrollAreaRef}
              onScrollPositionChange={handleScroll}
              style={{ pointerEvents: isFetchingNextPage ? 'none' : 'auto' }}
            >
              {messages.map((message) => (
                <GlobalChatMessagesListItem
                  key={message.id}
                  message={message}
                  currentUserId={currentUserId}
                />
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {showScrollToBottomButton && (
              <ActionIcon
                variant="filled"
                size="xl"
                radius="xl"
                color="primary"
                onClick={() => scrollToBottom()}
                style={{
                  position: 'absolute',
                  bottom: rem(1),
                  right: rem(1),
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

import { notFound } from 'next/navigation';

import { Container } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { StoryContent } from '@/components/stories';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  try {
    const { id } = await params;

    if (isNaN(Number(id))) {
      notFound();
    }

    return (
      <Container size="lg" py="xl">
        <StoryContent storyId={Number(id)} />
      </Container>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}

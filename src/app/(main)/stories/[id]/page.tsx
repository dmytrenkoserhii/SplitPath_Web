import { notFound } from 'next/navigation';

import { Container } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { StoryContent } from '@/components/stories';
import { storiesService } from '@/services';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  try {
    const { id } = await params;
    const story = await storiesService().findOneById(Number(id));

    if (!story) {
      notFound();
    }

    return (
      <Container size="lg" py="xl">
        <StoryContent story={story} />
      </Container>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}

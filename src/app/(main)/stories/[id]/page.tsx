import { Container } from '@mantine/core';

import { StoryContent } from '@/components/stories';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;

  return (
    <Container size="lg" py="xl">
      <StoryContent storyId={Number(id)} />
    </Container>
  );
}

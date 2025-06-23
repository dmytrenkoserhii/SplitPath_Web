import { Box, Center, Text, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { StoriesPagination } from '@/components/stories';
import { StoryCardsList } from '@/components/stories/story-cards-list';
import { storiesService } from '@/services/stories.service';

interface ActiveStoriesPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ActiveStoriesPage({ searchParams }: ActiveStoriesPageProps) {
  try {
    const currentPage = Number(searchParams.page) || 1;
    const itemsPerPage = 9;

    const storiesData = await storiesService().findAllPaginated({
      page: currentPage,
      limit: itemsPerPage,
      status: 'new',
    });

    return (
      <Box>
        <Title c="orange" ta="center" mb="md">
          Active Stories
        </Title>

        <Box
          mb="md"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text c="dimmed">{storiesData.meta.totalItems} stories found</Text>
          <Text c="dimmed" size="sm">
            Page {storiesData.meta.currentPage} of {storiesData.meta.totalPages}
          </Text>
        </Box>

        {!storiesData.items.length ? (
          <Center py="xl">
            <Text size="lg" c="dimmed">
              No active stories found
            </Text>
          </Center>
        ) : (
          <>
            <StoryCardsList stories={storiesData.items} />

            {storiesData.meta.totalPages > 1 && (
              <StoriesPagination
                currentPage={storiesData.meta.currentPage}
                totalPages={storiesData.meta.totalPages}
              />
            )}
          </>
        )}
      </Box>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}

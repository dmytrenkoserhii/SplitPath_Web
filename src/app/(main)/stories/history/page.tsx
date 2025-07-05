import { Box, Center, Text, Title } from '@mantine/core';

import { ServerError } from '@/components/auth';
import { StoryCardsList } from '@/components/stories/story-cards-list';
import { Pagination } from '@/components/ui';
import { StoryStatus } from '@/enums';
import { storiesService } from '@/services/stories.service';

type SearchParamsType = { page: string };

interface HistoryPageProps {
  searchParams: SearchParamsType;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  try {
    const currentPage = Number(searchParams.page) || 1;
    const itemsPerPage = 9;

    const storiesData = await storiesService().findAllPaginated({
      page: currentPage,
      limit: itemsPerPage,
      status: StoryStatus.FINISHED,
    });

    if (!storiesData.items.length) {
      return (
        <Box>
          <Title c="tertiary" ta="center" mb="md">
            Finished Stories
          </Title>
          <Center py="xl">
            <Text size="lg" c="dimmed">
              No finished stories found
            </Text>
          </Center>
        </Box>
      );
    }

    return (
      <Box>
        <Title c="tertiary" ta="center" mb="md">
          Finished Stories
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

        <StoryCardsList stories={storiesData.items} />

        {storiesData.meta.totalPages > 1 && (
          <Pagination
            currentPage={storiesData.meta.currentPage}
            totalPages={storiesData.meta.totalPages}
          />
        )}
      </Box>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}

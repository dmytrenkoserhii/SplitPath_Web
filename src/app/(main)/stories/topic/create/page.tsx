import { Container, Title, Paper } from '@mantine/core';
import { CreateTopicForm } from '@/components/stories/create-topic-form';

export default function CreateTopicPage() {
  return (
    <Container size="sm" py="xl">
      <Title c="orange" mb="xl">Create New Story Topic</Title>
      <Paper shadow="sm" p="xl" withBorder>
        <CreateTopicForm />
      </Paper>
    </Container>
  );
} 
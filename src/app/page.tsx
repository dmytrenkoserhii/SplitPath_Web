import { Feature } from '@/components/@home/Feature';
import { StoryPreview } from '@/components/@home/StoryPreview';
import {
  Box,
  Title,
  Text,
  Button,
  Container,
  Stack,
  Group,
  ThemeIcon,
  SimpleGrid,
  Card,
  List,
  ListItem,
  CardSection,
} from '@mantine/core';
import {
  Book,
  Brain,
  Smartphone,
  User,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <Container size='lg'>
      {/* Hero Section */}
      <Box py={80} ta='center'>
        <Title order={1} size='3.5rem' fw={900} c='orange'>
          Your Story, Your Choices
        </Title>
        <Text c='dimmed' mt='md' size='xl' maw={600} mx='auto'>
          Experience interactive storytelling powered by AI. Every choice
          matters, every story is unique.
        </Text>
        <Button
          component={Link}
          href='/story-selection'
          size='xl'
          variant='gradient'
          gradient={{ from: 'orange', to: 'red' }}
          mt={40}
        >
          Start Your Adventure
        </Button>
      </Box>

      {/* Features Section */}
      <Stack gap={50} mt={50}>
        <Feature
          icon={<Brain size={24} />}
          title='AI-Powered Narratives'
          description='Unique stories generated in real-time, adapting to your choices and playing style.'
        />
        <Feature
          icon={<Book size={24} />}
          title='Rich Interactive Stories'
          description='Manage inventory, track status effects, and make decisions that impact your journey.'
        />
        <Feature
          icon={<Smartphone size={24} />}
          title='Cross-Platform'
          description='Available on web and mobile devices - continue your story anywhere.'
        />
        <Feature
          icon={<User size={24} />}
          title='Personalized Experience'
          description='Every decision shapes your unique narrative path and character development.'
        />
      </Stack>

      {/* How It Works Section */}
      <Box py={80}>
        <Title order={2} size='2.5rem' ta='center' mb={50} c='orange'>
          How It Works
        </Title>
        <List
          spacing='xl'
          size='lg'
          center
          icon={
            <ThemeIcon color='orange' size={32} radius='xl'>
              <ChevronRight size={18} />
            </ThemeIcon>
          }
        >
          <ListItem>
            <Text size='xl'>Choose your story theme and setting</Text>
            <Text c='dimmed' mt={5}>
              Select from various genres like fantasy, sci-fi, mystery, or
              create your own custom world
            </Text>
          </ListItem>
          <ListItem>
            <Text size='xl'>Create your character</Text>
            <Text c='dimmed' mt={5}>
              Customize your protagonist's traits, skills, and background story
            </Text>
          </ListItem>
          <ListItem>
            <Text size='xl'>Make meaningful choices</Text>
            <Text c='dimmed' mt={5}>
              Every decision shapes your story and affects your character's
              journey
            </Text>
          </ListItem>
          <ListItem>
            <Text size='xl'>Experience dynamic storytelling</Text>
            <Text c='dimmed' mt={5}>
              Watch as AI adapts the narrative based on your choices and playing
              style
            </Text>
          </ListItem>
        </List>
      </Box>

      {/* Popular Stories Preview */}
      <Box py={80}>
        <Container size='lg'>
          <Title order={2} size='2.5rem' ta='center' mb={50} c='orange'>
            Featured Adventures
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing='xl'>
            <StoryPreview
              title='The Crystal Prophecy'
              description='A fantasy epic where magic and destiny collide in a world on the brink of chaos'
              imageUrl='/images/story1.jpg'
            />
            <StoryPreview
              title='Space Colony Zero'
              description="Lead humanity's first interstellar colony and face the unknown challenges of deep space"
              imageUrl='/images/story2.jpg'
            />
            <StoryPreview
              title="Detective's Dilemma"
              description='Solve complex mysteries and uncover dark secrets in this noir-style thriller'
              imageUrl='/images/story3.jpg'
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box py={50} ta='center'>
        <Button
          component={Link}
          href='/story-selection'
          size='xl'
          variant='gradient'
          gradient={{ from: 'orange', to: 'red' }}
          leftSection={<Sparkles size={20} />}
        >
          Start Writing Your Story
        </Button>
      </Box>
    </Container>
  );
}

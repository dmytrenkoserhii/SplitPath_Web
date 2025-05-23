'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Paper, Title, Text, Stack, Loader, Center } from '@mantine/core';
import { authService } from '@/services';

export const EmailVerifier = () => {
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    // If no token, redirect to dashboard
    if (!token) {
      router.push('/stories/selection');
      return;
    }
    
    const verifyToken = async () => {
      try {
        const { verifyEmail } = authService();
        const result = await verifyEmail(token);
        
        if (result.response.ok) {
          // Success - redirect to main app
          router.push('/stories/selection');
        } else {
          setStatus('error');
          setErrorMessage(result.response.statusText || 'Verification failed');
          // Redirect after error
          setTimeout(() => {
            router.push('/stories/selection');
          }, 3000); // Give user time to read the error
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('An error occurred during verification');
        console.error(err);
        // Redirect after error
        setTimeout(() => {
          router.push('/stories/selection');
        }, 3000); // Give user time to read the error
      }
    };
    
    verifyToken();
  }, [searchParams, router]);
  
  return (
    <Paper
      shadow='md'
      radius='md'
      p='xl'
      withBorder
      w={{ base: '90%', sm: 450 }}
    >
      <Stack gap='md'>
        <Title order={2} ta='center' mt='md' mb={30}>
          Email Verification
        </Title>
        
        {status === 'loading' ? (
          <Center>
            <Stack align="center" gap="md">
              <Loader size="md" />
              <Text>Verifying your email...</Text>
            </Stack>
          </Center>
        ) : (
          <Text ta='center' c='red'>{errorMessage}</Text>
        )}
      </Stack>
    </Paper>
  );
};
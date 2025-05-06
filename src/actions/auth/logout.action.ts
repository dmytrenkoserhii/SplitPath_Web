'use server';

import { setCookiesFromResponse } from '@/utils/cookies';
import { cookies } from 'next/headers';

interface ActionResult {
  success: boolean;
  error?: string;
}

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing environment variable: BACKEND_URL');
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    // Get the cookies from the request
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      credentials: 'include',
    });
    console.log('Response:', response.ok);

    // Explicitly delete cookies even if the backend call fails
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      return { success: false, error: errorMessage };
    }

    // Process any additional cookie changes from response
    await setCookiesFromResponse(response);

    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);

    // Try to clear cookies even if there was an error with the request
    try {
      const cookieStore = await cookies();
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
    } catch (e) {
      console.error('Error clearing cookies:', e);
    }

    return {
      success: false,
      error: 'An unknown error occurred during logout.',
    };
  }
}

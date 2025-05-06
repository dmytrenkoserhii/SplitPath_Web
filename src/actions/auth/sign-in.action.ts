'use server';

import { z } from 'zod';
import { SignInFormSchema } from '@/schemas/auth';
import { setCookiesFromResponse } from '@/utils/cookies';

type SignInInput = z.infer<typeof SignInFormSchema>;

interface ActionResult {
  success: boolean;
  error?: string;
}

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing environment variable: BACKEND_URL');
}

export async function signInAction(values: SignInInput): Promise<ActionResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      return { success: false, error: errorMessage };
    }

    // Set cookies from response using the utility function
    await setCookiesFromResponse(response);

    return { success: true };
  } catch (error) {
    console.error('Error during sign in:', error);
    return {
      success: false,
      error: 'An unknown error occurred during sign in.',
    };
  }
}

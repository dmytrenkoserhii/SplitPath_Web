import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { xiorClient } from '@/lib';

export async function GET() {
  try {
    const cookieStore = cookies();
    const authCookies = cookieStore.toString();

    const response = await xiorClient.get('/account', {
      headers: {
        Cookie: authCookies,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Account API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authCookies = cookieStore.toString();
    const body = await request.json();

    const response = await xiorClient.patch('/account', body, {
      headers: {
        Cookie: authCookies,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('Account Update API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const authCookies = cookieStore.toString();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account`, {
      method: 'GET',
      headers: {
        Cookie: authCookies,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch account' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Account API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authCookies = cookieStore.toString();
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/account`, {
      method: 'PATCH',
      headers: {
        Cookie: authCookies,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to update account' },
        { status: response.status },
      );
    }

    const data = await response.json();
    revalidateTag('account');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Account Update API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

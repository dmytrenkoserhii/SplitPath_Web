import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { accountsService } from '@/services/account.service';

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookies = cookieStore.toString();
    const body = await request.json();

    const account = await accountsService().updateViaBackend(body, {
      Cookie: authCookies,
      'Content-Type': 'application/json',
    });

    revalidatePath('/profile');

    return NextResponse.json(account);
  } catch (error: unknown) {
    console.error('Account Update API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

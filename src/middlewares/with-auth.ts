import { NextFetchEvent, type NextRequest, NextResponse } from 'next/server';

import { isProtectedRoute } from '@/utils';
import { createAuthHeaders } from '@/utils/create-auth-headers.util';
import { logout } from '@/utils/logout.util';
import { refreshAccessToken } from '@/utils/refresh-access-token.util';
import { verifyAccessToken } from '@/utils/verify-access-token.util';

import { CustomMiddleware } from './chain';

// TODO: perhaps we need to define all our routes in a single file
// to avoid mistakes
export function withAuth(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get('access_token');
    const refreshToken = request.cookies.get('refresh_token');
    const headers = createAuthHeaders(request.headers, {
      accessToken,
      refreshToken,
    });

    if (isProtectedRoute(pathname) && !accessToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (!isProtectedRoute(pathname) && accessToken) {
      return NextResponse.redirect(new URL('/protected/server', request.url));
    }

    try {
      if (isProtectedRoute(pathname) && accessToken) {
        await verifyAccessToken(headers);
      }
    } catch (_) {
      try {
        response = await refreshAccessToken(response, headers);
      } catch (_) {
        response = await logout(response, headers);
      }
    }

    return middleware(request, event, response);
  };
}

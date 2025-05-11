import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse } from 'next/server';

/**
 * Appends an array of `ResponseCookie` objects to a `NextResponse`.
 * Each cookie in the array is set on the response with its respective name, value, and options.
 *
 * @param response The `NextResponse` to which the cookies will be appended.
 * @param cookies An array of `ResponseCookie` objects to append to the response.
 * @returns The `NextResponse` with the appended cookies.
 */
export const appendCookiesToNextResponse = (
  response: NextResponse,
  cookies: ResponseCookie[]
) => {
  cookies.forEach((cookie) => {
    const { name, value, ...options } = cookie;
    response.cookies.set(name, value, options);
  });

  return response;
};

import { chain, withAuth, withInitializeResponse } from './middlewares';

export default chain([withInitializeResponse, withAuth]);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
};

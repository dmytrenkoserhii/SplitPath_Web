import { PUBLIC_ROUTES } from '@/constants';

export const isProtectedRoute = (pathname: string) => {
  return !PUBLIC_ROUTES.includes(pathname);
};

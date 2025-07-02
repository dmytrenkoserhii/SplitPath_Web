import xior, { XiorError, XiorRequestConfig } from 'xior';

import { authService } from '@/services';
import { isClientSide } from '@/utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing environment variable: BACKEND_URL');
}

export const xiorClient = xior.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  cache: 'no-store',
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: XiorRequestConfig;
}> = [];

const processQueue = (error: XiorError | null) => {
  failedQueue.forEach((prom) => {
    if (!error) {
      prom.resolve(xiorClient.request(prom.config));
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Request interceptor
xiorClient.interceptors.request.use(async (config) => {
  if (!isClientSide()) {
    const { cookies } = await import('next/headers');
    const cookiesString = (await cookies())
      .getAll()
      .map((item) => `${item.name}=${item.value}`)
      .join('; ');
    config.headers = {
      ...config.headers,
      cookie: cookiesString,
    };
  }

  return config;
});

// Response interceptor for handling 401
xiorClient.interceptors.response.use(
  (response) => response,
  async (error: XiorError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      isClientSide() &&
      !originalRequest?.url?.includes('/sign-in') &&
      !error.response?.request.url.includes('/auth/refresh')
    ) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await authService().refreshAccessToken();
          isRefreshing = false;
          processQueue(null);
          return xiorClient.request(originalRequest as XiorRequestConfig);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError as XiorError);
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        if (originalRequest) {
          failedQueue.push({ resolve, reject, config: originalRequest });
        } else {
          reject(error);
        }
      });
    }

    if (isClientSide() && error.response?.status === 401) {
      window.location.reload();
    }

    return Promise.reject(error);
  },
);

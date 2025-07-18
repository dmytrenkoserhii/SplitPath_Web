import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';

import { ReactQueryClientProvider } from '@/providers';
import { theme } from '@/theme';

import './globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SplitPath',
  description: 'AI generated interactive stories',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={roboto.className}>
        <ReactQueryClientProvider>
          <MantineProvider theme={theme} defaultColorScheme="dark">
            <Notifications />
            {children}
          </MantineProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}

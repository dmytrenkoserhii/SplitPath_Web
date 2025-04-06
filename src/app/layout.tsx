import '@mantine/core/styles.css';
import './globals.css';

import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core';
import { theme } from '@/theme';

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
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme='auto' />
      </head>
      <body className={roboto.className}>
        <MantineProvider theme={theme} defaultColorScheme='auto'>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}

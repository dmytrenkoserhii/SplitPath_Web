import { AppShell, AppShellMain } from '@mantine/core';
import { HeaderWithBurger, MainNavbar, MainFooter } from '@/components/layout';
import { NavbarProvider } from '@/hooks';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavbarProvider>
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: true, desktop: false },
        }}
        padding='md'
      >
        <HeaderWithBurger />
        <MainNavbar />
        <AppShellMain>{children}</AppShellMain>
        <MainFooter />
      </AppShell>
    </NavbarProvider>
  );
}

import { AppShell, AppShellMain } from '@mantine/core';
import { HeaderWithBurger, MainNavbar, MainFooter } from '@/components/layout';
import { NavbarProvider } from '@/hooks';
import { getCurrentUserAction } from '@/actions/users';

// TODO: It's server side but it's not wrapped in a try catch block as it should be with server components
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentUserAction();

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
        <HeaderWithBurger user={user} />
        <MainNavbar />
        <AppShellMain>{children}</AppShellMain>
        <MainFooter />
      </AppShell>
    </NavbarProvider>
  );
}

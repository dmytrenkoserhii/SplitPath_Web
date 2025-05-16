import { AppShell, AppShellMain } from '@mantine/core';
import { Header, Navbar, Footer } from '@/components/layout';
import { NavbarProvider } from '@/hooks';
import { getCurrentUserAction } from '@/actions/users';
import { ServerError } from '@/components/auth';
import { FriendsSocketManager } from '@/components/friends';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { user } = await getCurrentUserAction();

    return (
      <NavbarProvider>
        <FriendsSocketManager />

        <AppShell header={{ height: 60 }} footer={{ height: 60 }} padding='md'>
          <Header user={user} />
          <Navbar />
          <AppShellMain>{children}</AppShellMain>
          <Footer />
        </AppShell>
      </NavbarProvider>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}

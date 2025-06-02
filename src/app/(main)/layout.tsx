import { AppShell, AppShellMain } from '@mantine/core';
import { Header, Navbar, Footer } from '@/components/layout';
import { NavbarProvider } from '@/hooks';
import { getCurrentUserAction } from '@/actions/users';
import { ServerError } from '@/components/auth';
import { FriendsSocketManager } from '@/components/friends';
import { ChatsSocketManager } from '@/components/chats/chats-socket-manager';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { user } = await getCurrentUserAction();

    return (
      <NavbarProvider>
        {/* We put our sockets here, so we connect to them when the user is logged in and disconnect when the user is logged out */}
        <FriendsSocketManager />
        <ChatsSocketManager />

        <AppShell header={{ height: 60 }} footer={{ height: 60 }} padding='md'>
          <Header user={user} />
          <Navbar user={user} />
          <AppShellMain>{children}</AppShellMain>
          <Footer />
        </AppShell>
      </NavbarProvider>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}

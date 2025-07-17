import { AppShell, AppShellMain } from '@mantine/core';

import { getCurrentUserAction } from '@/actions/users';
import { ServerError } from '@/components/auth';
import { ChatsSocketManager } from '@/components/chats/chats-socket-manager';
import { FriendsSocketManager } from '@/components/friends';
import { GlobalChat, GlobalChatSocketManager } from '@/components/global-chat';
import { Footer, Header, Navbar } from '@/components/layout';
import { NavbarProvider } from '@/hooks';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  try {
    const { user } = await getCurrentUserAction();

    return (
      <NavbarProvider>
        {/* We put our sockets here, so we connect to them when the user is logged in and disconnect when the user is logged out */}
        <FriendsSocketManager />
        <ChatsSocketManager />
        <GlobalChatSocketManager />

        <AppShell header={{ height: 60 }} footer={{ height: 60 }} padding="md">
          <Header user={user} />
          <Navbar user={user} />
          <AppShellMain>{children}</AppShellMain>
          <Footer />
        </AppShell>

        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <GlobalChat />
        </div>
      </NavbarProvider>
    );
  } catch (error) {
    return <ServerError error={error} />;
  }
}

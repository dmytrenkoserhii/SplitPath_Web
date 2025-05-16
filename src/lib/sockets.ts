import { Socket, io } from 'socket.io-client';

let friendsSocket: Socket;

export const getFriendsSocket = (): Socket => {
  if (!friendsSocket) {
    friendsSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/friends`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      extraHeaders: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    });
  }
  return friendsSocket;
};

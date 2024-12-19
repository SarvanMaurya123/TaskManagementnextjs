import { Server as SocketIOServer } from 'socket.io';

declare global {
    // Add a `global.io` property to access the Socket.IO instance
    var io: SocketIOServer | undefined;
}

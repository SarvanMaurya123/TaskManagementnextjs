import { createServer } from 'http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();
const port = 3000;

app.prepare().then(() => {
    const httpServer = createServer(handler);

    // Initialize Socket.IO
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: 'http://localhost:3001', // Your frontend URL
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('User connected');

        // Listen for joinChat event, where the frontend sends a chatId
        socket.on('joinChat', (chatId) => {
            console.log(`User joined chat: ${chatId}`);
            socket.join(chatId);  // The user joins the chat room based on chatId
        });

        // Listen for newMessage event and broadcast the message to other users in the chat room
        socket.on('newMessage', (data) => {
            const { chatId, message } = data;
            console.log(`New message in chat ${chatId}: ${message}`);
            io.to(chatId).emit('newMessage', message); // Emit to all users in the chat
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    }).on('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
    });
});

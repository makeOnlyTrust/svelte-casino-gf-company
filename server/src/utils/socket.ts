// socket.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Server as HTTPSServer } from 'https';

let io: SocketIOServer;

export const initSocket = (server: HTTPServer | HTTPSServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: [
                'http://localhost:9002',
                'http://localhost',
                'http://127.0.0.1',
                'http://localhost:5173',
                'http://localhost:5174',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:5174',
                'https://powun.com',
                'https://admin.powun.com',
                'https://demo.goodfriendsgaming.com'
            ],
            methods: ['GET', 'POST', 'PATCH', 'DELETE'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        socket.on('joinRoom', async (userRoom: any, callback: any) => {
            socket.join(userRoom);
        });

        console.log('socket connected');
        io.to(socket.id).emit('socketId', socket.id);
    });
};

export const getSocketIO = (): SocketIOServer => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }

    return io;
};

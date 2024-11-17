const SOCKET_ENDPOINT = import.meta.env.VITE_SOCKET_SERVER_GFGAME;
import io from 'socket.io-client';
export const socket = io(SOCKET_ENDPOINT);

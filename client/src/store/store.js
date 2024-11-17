import { writable } from 'svelte/store';
// import { ID_KEY, SOCKET_ENDPOINT } from './const'

const SOCKET_ENDPOINT = import.meta.env.VITE_SOCKET_SERVER;
const ID_KEY = import.meta.env.VITE_ID_KEY;

import io from 'socket.io-client';
export const socket = io(SOCKET_ENDPOINT);

export const uuid = (prefix = '', date = true) => {
  let counter = 0;
  return `${date ? Date.now().toString(16) : ''}${prefix}${counter++}`;
};

export const joinRoom = (name, roomID) => {
  const user = { username: name, room: roomID };
  socket.emit('join-room', user, (value) => {
    // const person = roomUsers.find(({ id }) => id === currentUser.id)
    // person.isSelf = true
    // localStorage.setItem(ID_KEY, JSON.stringify(user))
  });
};
export const checkRoom = () => {
  const saveUser = JSON.parse(localStorage.getItem(ID_KEY));
  if (saveUser) {
    joinRoom(saveUser.username, saveUser.room);
  }
};

export const leaveRoom = (name, roomID, callback) => {
  socket.emit('leave-room', name, roomID, (data) => {
    callback(data);
  });
};

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToSongInfo(cb) {
  // socket.on('timer', timestamp => cb(null, timestamp));
  socket.on('songInfoUpdate', songInfo => {
    cb(null, songInfo)
  });
  socket.emit('subscribeToSongInfo');
}

export { subscribeToSongInfo };
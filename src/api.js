import openSocket from 'socket.io-client';
var socket;

function openConnection(cb) {
  socket = openSocket('http://localhost:8000');
}

function subscribeToSongInfo(cb) {
  // socket.on('timer', timestamp => cb(null, timestamp));
  socket.on('songInfoUpdate', songInfo => {
    cb(null, songInfo)
  });
  socket.emit('subscribeToSongInfo');
}

function subscribeToHostUpdates(cb) {
  socket.on('hostDisconnected', () => {
    cb('hostDisconnected', null)
  });

  socket.on('hostExists', (hostID) => {
    cb('hostExists', hostID)
  });
}

function chordUpdate(cb) {
  socket.on('chordUpdate', (chords) => {
    cb(chords)
  })
}

function announceReady() {
  socket.emit('ready')
}

function startPlaying(cb) {
  socket.on('startPlaying', () => {
    console.log('start now');
    
    cb(true)
  })
}


/// HOST

function tellStart() {
  socket.emit('initPlaying')
}

function getClientsReady(cb) {
  socket.on('clientsReady', clientsReady => {
    cb(clientsReady)
  })
}

function connectHost(cb) {
  socket.emit('connectHost', () => {
    cb(null, true)
  });
}

function pingClientStatus() {
  socket.emit('checkStatus')
}

function hostSuccess(cb) {
  socket.on('hostExists', () => {
    cb(false, null)
  });

  socket.on('hostConfirm', (hostID) => {
    cb(true, hostID)
  })
}

function sendChords(chords) {
  socket.emit('initChords', chords);
}

function clientUpdates(cb) {
  socket.on('clientConnected', (connections) => {
    cb(connections)
  })
}

function disconnectMe() {
  socket.close()
}

export { subscribeToSongInfo, 
  hostSuccess, connectHost, subscribeToHostUpdates, 
  disconnectMe, openConnection, clientUpdates,
  sendChords, chordUpdate, announceReady, getClientsReady,
  pingClientStatus, startPlaying,
  tellStart
};
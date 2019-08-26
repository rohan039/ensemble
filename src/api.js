import openSocket from 'socket.io-client';
var socket;

function openConnection(cb) {
  socket = openSocket('http://localhost:8000');
}

function getID(cb) {
  socket.on('getID', myID => {
    cb(myID)
  })
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

function announceModelReady() {
  socket.emit('modelReady')
}

function announceNotesReady() {
  socket.emit('notesReady')
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

function getClientsModelReady(cb) {
  socket.on('clientsModelReady', clientsModelReady => {
    cb(clientsModelReady)
  })
}

function getClientsNotesReady(cb) {
  socket.on('clientsNotesReady', clientsNotesReady => {
    cb(clientsNotesReady)
  })
}

function connectHost(cb) {
  socket.emit('connectHost', () => {
    cb(null, true)
  });
}

function pingClientModelStatus() {
  socket.emit('checkModelStatus')
}

function pingClientNotesStatus() {
  socket.emit('checkNotesStatus')
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

export { 
  getID,
  subscribeToSongInfo, 
  hostSuccess, connectHost, subscribeToHostUpdates, 
  disconnectMe, openConnection, clientUpdates,
  sendChords, chordUpdate,

  getClientsNotesReady, getClientsModelReady,
  announceModelReady, announceNotesReady,
  pingClientModelStatus, pingClientNotesStatus, 
  
  startPlaying,
  tellStart, 
};
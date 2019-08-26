var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var songInfo = {
  beat: 1,
  bar: 1,
  chord: structure[0],
  chordProgress: 0,
}

var timers = []

var hostID;

var connections = [];
var clientsReady = [];

io.on('connection', (client) => {

  connections.push(client.id)

  if (hostID) {
    io.to(hostID).emit('clientConnected', connections);
  }

  console.log(client.id, 'connected');

  client.on('checkStatus', () => {
    io.to(hostID).emit('clientsReady', clientsReady);
  })

  client.on('initPlaying', () => {
    client.broadcast.emit('startPlaying');
  })

  client.on('connectHost', () => {
    if (!hostID) {
      console.log(client.id, 'is now host');

      hostIsConnected = true;
      hostID = client.id;
      io.to(hostID).emit('hostConfirm', hostID);
      io.to(hostID).emit('clientConnected', connections);
      connections = connections.filter(item => item === hostID)
    } else {
      console.log('a host already exists');
      client.emit('hostExists', hostID);
    }
  })

  client.on('disconnect', () => {

    connections = connections.filter(item => item !== client.id)
    
    io.to(hostID).emit('clientConnected', connections);
    console.log(hostID, 'host id');
    
    if (client.id !== hostID) {
      console.log(client.id,'disconnected');
      clientsReady = clientsReady.filter(item => item !== client.id);
    } else {
      console.log(client.id,'disconnected  <-- Host');
      client.emit('hostDisconnected');
      hostID = undefined;
    }
  });

  client.on('initChords', (chords) => {
    client.broadcast.emit('chordUpdate', chords);
  })

  client.on('ready', () => {

    clientsReady.push(client.id);
    console.log(client.id, 'READY');
    
    io.to(hostID).emit('clientsReady', clientsReady);

  })

  client.on('subscribeToSongInfo', () => {

    console.log('subscribed to song info');

    songInfo = {
      beat: 1,
      bar: 1,
      chord: structure[0],
      chordProgress: 0,
    }

    if (timers.length === 1) {
      clearInterval(timers[0]);
      timers = [];
    }

    timers.push(setInterval(() => {
      client.emit('songInfoUpdate', songInfo);

      songInfo.beat++;
      if (songInfo.beat > 4) {
        songInfo.beat = 1;
        songInfo.bar++;
        songInfo.chordProgress++;
        if (songInfo.chordProgress > 11) {
          songInfo.chordProgress = 0;
        }
        songInfo.chord = structure[songInfo.chordProgress];
      }
    }, 750));
  })

});

const port = '8000';
io.listen(port);
console.log('listening on port', port);

// io.on('connection', (client) => {
//   client.on('subscribeToTimer', (interval) => {
//     console.log('client is subscribing to timer with interval ', interval);
//     setInterval(() => {
//       client.emit('timer', num);
//       num++;
//     }, interval);
//   });
// });
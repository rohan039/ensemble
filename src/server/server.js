var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var time = 1;
var controlBPM;

var timers = []

var hostID;

var connections = [];
var clientsModelReady = [];
var clientsNotesReady = [];

io.on('connection', (client) => {

  connections.push(client.id)

  // HOST must connect first
  console.log(client.id, 'connected', connections.length - 1);

  io.to(client.id).emit('getID', client.id, connections.length - 1);


  if (hostID) {
    io.to(hostID).emit('clientConnected', connections);
  }

  client.on('checkModelStatus', () => {
    io.to(hostID).emit('clientsModelReady', clientsModelReady);
  })

  client.on('checkNoteStatus', () => {
    io.to(hostID).emit('clientsNotesReady', clientsNotesReady);
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
      clientsModelReady = clientsModelReady.filter(item => item !== client.id);
      clientsNotesReady = clientsNotesReady.filter(item => item !== client.id);
    } else {
      timers.forEach(timer => clearInterval(timer));
      console.log(client.id,'disconnected  <-- Host');
      client.emit('hostDisconnected');
      hostID = undefined;
    }
  });

  client.on('initChords', (chords, bpm) => {
    controlBPM = bpm;
    client.broadcast.emit('chordUpdate', chords, bpm);
  })

  client.on('modelReady', () => {

    clientsModelReady.push(client.id);
    console.log(client.id, 'Model READY');
    
    io.to(hostID).emit('clientsModelReady', clientsModelReady);

  })

  client.on('notesReady', () => {

    clientsNotesReady.push(client.id);
    console.log(client.id, 'Notes READY');
    
    io.to(hostID).emit('clientsNotesReady', clientsNotesReady);

  })

  client.on('subscribeToTime', () => {

    client.emit('timeUpdate', new Date().getTime()/1000);

    let startTime = new Date();
    timers.push(setInterval(() => {
      
      client.emit('timeUpdate', Math.floor(Math.abs(new Date() - startTime) /1000));
    }, 1000));
  })

});

const port = '8000';
io.listen(port);
console.log('listening on port', port);

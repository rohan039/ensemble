var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// Blues in C
// C7-4 | F7-2 | C7-2 | G7-1 | F7-1 | C7-2 |

// in 12 Semitones
var chords = {
  C7 : [0, 4, 7, 10],
  F7 : [5, 9, 11, 14],
  G7 : [7, 11, 14, 17] 
}

// improv rnn

var structure = [
  chords.C7, chords.C7, chords.C7, chords.C7,
  chords.F7, chords.F7,
  chords.C7, chords.C7,
  chords.G7,
  chords.F7,
  chords.C7, chords.C7
]

var songInfo = {
  beat: 1,
  bar: 1,
  chord: structure[0],
  chordProgress: 0,
}

var timers = []

io.on('connection', (client) => {
  
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
import React from 'react';
// import { subscribeToSongInfo } from '../api';
import PianoLayout from './PianoLayout';
import * as Tone from 'tone';
import * as mm from '@magenta/music'

var blues = [0, 3, 5, 6, 7, 10, 12];

var TWINKLE_TWINKLE = {
  notes: [
    {pitch: 60, startTime: 0.0, endTime: 0.5},
    {pitch: 60, startTime: 0.5, endTime: 1.0},
    {pitch: 67, startTime: 1.0, endTime: 1.5},
    {pitch: 67, startTime: 1.5, endTime: 2.0},
    {pitch: 69, startTime: 2.0, endTime: 2.5},
    {pitch: 69, startTime: 2.5, endTime: 3.0},
    {pitch: 67, startTime: 3.0, endTime: 4.0},
    {pitch: 65, startTime: 4.0, endTime: 4.5},
    {pitch: 65, startTime: 4.5, endTime: 5.0},
    {pitch: 64, startTime: 5.0, endTime: 5.5},
    {pitch: 64, startTime: 5.5, endTime: 6.0},
    {pitch: 62, startTime: 6.0, endTime: 6.5},
    {pitch: 62, startTime: 6.5, endTime: 7.0},
    {pitch: 60, startTime: 7.0, endTime: 8.0},  
  ],
  totalTime: 8
};

var rnn_steps = 20;
var rnn_temperature = 1.5;

var music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
music_rnn.initialize();

// Create a player to play the sequence we'll get from the model.
var rnnPlayer = new mm.Player();

function play() {
  if (rnnPlayer.isPlaying()) {
    rnnPlayer.stop();
    return;
  }
      
  // The model expects a quantized sequence, and ours was unquantized:
  const qns = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4);
  music_rnn
  .continueSequence(qns, rnn_steps, rnn_temperature)
  .then((sample) => rnnPlayer.start(sample));
}

// setInterval(() => {
//   play();
//   console.log('ds');
  
// }, 5000);
// document.body.appendChild(viz)

export class InfoDisplay extends React.PureComponent {

  constructor(props) {
    super(props);
    this.synth = new Tone.PolySynth().toMaster();
    this.soloSynth1 = new Tone.Synth().toMaster();
    this.soloSynth2 = new Tone.Synth().toMaster();

    
    
    
    
    Tone.Master.volume.value = -20;
    Tone.Transport.bpm.value = 113;
    
    // subscribeToSongInfo((err, songInfo) => {

    //   this.setState({
    //     songInfo
    //   });
      
    //   // console.log(songInfo.chord);
    //   let chord = songInfo.chord.map((n) => { return Tone.Frequency((n + 48), "midi").toNote(); });

    //   this.chord = chord;
    //   this.synth.triggerAttackRelease(chord, "16n");

    //   let note = Tone.Frequency((blues[Math.floor(Math.random() * blues.length)] + 60), "midi").toNote();
    //   this.soloSynth1.triggerAttackRelease(note, "32n");
    //   let note2 = Tone.Frequency((blues[Math.floor(Math.random() * blues.length)] + 84), "midi").toNote();
    //   this.soloSynth2.triggerAttackRelease(note2, "16n", 0.5);
    //   //  note = Tone.Frequency((blues[Math.floor(Math.random() * blues.length)] + 60), "midi").toNote();
    //   // this.soloSynth1.triggerAttackRelease(note, "32n");

    //   // console.log(note);
      
    //   // let note2 = Tone.Frequency((blues[Math.floor(Math.random() * blues.length)] + 60), "midi").toNote();
    //   // if (note !== note2) {
    //   //   this.soloSynth2.triggerAttackRelease(note2, "32n", "2n");
    //   // }
      
    //   console.log(this.state.songInfo.chord);
      
    // });

    // var part = new Tone.Part(function(time, event){
    //   //the events will be given to the callback with the time they occur
    //   synth.triggerAttackRelease(event.note, event.dur, time)
    // }, [{ time : 0, note : 'C4', dur : '4n'},
    //   { time : {'4n' : 1, '8n' : 1}, note : 'E4', dur : '8n'},
    //   { time : '2n', note : 'G4', dur : '16n'},
    //   { time : {'2n' : 1, '8t' : 1}, note : 'B4', dur : '4n'}])
    
    // //start the part at the beginning of the Transport's timeline
    // part.start(0)
    
    // //loop the part 3 times
    // part.loop = 3
    // part.loopEnd = '1m'
    

    // let c1 = Tone.Frequency(( 60), "midi").toNote();
    // this.soloSynth2.triggerAttackRelease(c1, "16n", 0.5);

    this.state = {
      songInfo: {
        beat: 0,
        bar: 0,
        chord: 0,
        chordProgress: 0,
      }
    }
  }

  


  playPiano = (note) => {
    console.log('playing note', note);

    // if (e.state) {
    //   this.synth.triggerAttack(note);
    // } else {
    //   this.synth.triggerRelease();
    // }
  }



  render() {
    return (
      <div>
      
        <p>Info Display</p>
        <p>
          Beat: {this.state.songInfo.beat}
        </p>
        <p>
          Bar: {this.state.songInfo.bar}
        </p>
        <p>
          Chord: {this.chord}
        </p>
    
      </div>
    )
  }
}

export default InfoDisplay;

import React from 'react';
import { NavLink } from 'react-router-dom';
// import { TextButton, Dial } from 'react-nexusui';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Tone, { Transport, Player, Part, Event } from 'tone';
import AudioKeys from 'audiokeys';

import { MusicRNN } from '@magenta/music';
import { presetMelodies } from '../utils/clips';

import * as Chord from "tonal-chord";

import * as api from '../api';
import PianoLayout from './PianoLayout';
import InfoDisplay from './InfoDisplay';



export class BasePage extends React.Component {

  // TODO
  // Improv RNN https://github.com/tensorflow/magenta/tree/master/magenta/models/improv_rnn
  // Drums https://github.com/tensorflow/magenta/tree/master/magenta/models/drums_rnn
  // 

  constructor(props) {
    super(props);

    api.openConnection();

    this.synth = new Tone.PolySynth(3, Tone.Synth, {
      "oscillator": {
        "type": "fatsawtooth",
        // "type": "triangle8",
        // "type": "square",
        "count": 1,
        "spread": 30,
      },
      "envelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 0.5,
        "release": 0.4,
        "attackCurve": "exponential"
      },
    }).toMaster();


    this.comp = new Tone.PolySynth(6, Tone.Synth, {
      "oscillator": {
        "partials": [0, 2, 3, 4],
      }
    }).toMaster();

    Transport.bpm.value = 120;
    Transport.start();

    this.keyboard = new AudioKeys({
      polyphony: 8,
      rows: 1,
      priority: "last"
    });

    this.melodiesIndex = 0;

    this.muted = false;

    this.state = {
      loadingModel: true


    }
    this.nOfBars = 16;

    api.chordUpdate((chords) => {
      console.log('got chords');
      
      if (!this.state.loadingModel) {
        this.initChordRNN(chords)
      }
    })

    this.loadChordRNN();

    api.startPlaying((yesNo) => {
      if (yesNo) {
        if (this.part) {
          this.part.stop();
        }
        this.part.start();
      }
    })

  }

  componentWillUnmount() {
    console.log('unmount');

    api.disconnectMe(this.state.isHost)
  }

  loadChordRNN() {
    const model = new MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
    model.initialize()
      .then(() => {
        console.log('chord model loaded!');
        this.setState({ loadingModel: false })
        this.model = model;
        api.announceReady();
      })
  }


  initChordRNN(chordProgression) {

    let mel = this.model.continueSequence(
      presetMelodies['Twinkle'],
      this.nOfBars * 16,
      1.2, // Temp
      chordProgression,
    ).then((i) => {
      this.setMelodies([i], chordProgression);
    });

    // model.initialize()
    //   .then(() => {
    //     console.log('chord model initialized!');
    //     return model.continueSequence(
    //       presetMelodies['Twinkle'],
    //       this.nOfBars * 16,
    //       1.0, // Temp
    //       chordProgression,
    //     );
    //   })
    //   .then((i) => {
    //     // console.log(i);
    //     this.setMelodies([i], chordProgression);
    //     this.model = model;
    //     this.setState({
    //       loadingModel: false,
    //     });
    //     // this.sound.triggerSoundEffect(4);
    //     console.log('chord model loaded');
    //   });
  }


  setMelodies(m, c) {

    this.melodies = m;  

    let notes = m[this.melodiesIndex].notes.map(note => {
      const s = note.quantizedStartStep;
      return {
        'time': `${Math.floor(s / 16)}:${Math.floor(s / 4) % 4}:${(s % 4)}`,
        'note': Tone.Frequency(note.pitch, 'midi'),
        'isDrum': false,
        'chord': false,
      };
    });



    if (c) {
      this.chordProgression = c;
      const chordNotes = this.chordProgression.map((chord, i) => {
        const notes = Chord.notes(chord);
        return {
          'time': `${i}:0:0`,
          'note': notes,
          'isDrum': false,
          'chord': true,
        };
      });

      notes = notes.concat(chordNotes);
    }

    console.log(notes);

    if (this.part) {
      this.part.stop();
    }

    this.part = new Tone.Part((time, value) => {

      if (!value.chord) {
        // console.log(value.note - 36);

        this.synth.triggerAttackRelease(value.note, "8n", time);
        this.piano.toggleKey(Tone.Frequency(value.note).toMidi());
        // this.piano.toggleKey(Tone.Frequency(value.note).toMidi(), true);
      } else {
        const notes = value.note.map(n => n + '3');
        this.comp.triggerAttackRelease(notes, '1m', time, 1.0);
        notes.forEach(note => this.piano.toggleKey(Tone.Frequency(note).toMidi()));

        // notes.forEach(note => this.piano.toggleKey(Tone.Frequency(note).toMidi(), false));

      }

    }, notes);

    this.part.loop = 1;
    this.part.loopEnd = `${this.nOfBars}:0:0`;

    console.log(notes);
    // this.part.start();
  }

  generateOptions = () => {
    let oscTypes = [
      "square",
      "sine",
      "triangle",
      "sawtooth",
      "pwm",
      "pulse",
      "fatsquare",
      "fatsine",
      "fattriangle",
      "fatsawtooth",
      "fmsquare",
      "fmsine",
      "fmtriangle",
      "fmsawtooth",
      "amsquare",
      "amsine",
      "amtriangle",
      "amsawtooth"
    ]

    let res = [];
    oscTypes.forEach((type) => {
      res.push(<option key={type} value={type} >{type}</option>)
    })

    return res;
  }

  // playNote = (value) => {
  //   if (value[0] === 144 && value[2] != 0) {
  //     piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), true);
  //   } else if (value[0] === 144 || value[0] === 128) {
  //     piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), false);
  //   }
  // }

  initPiano = (piano) => {

    // piano.colorize("accent", "#a3ffbc");
    // piano.colorize("fill", "#a3ffbc");

    this.piano = piano;
    this.piano.on("change", v => {

      if (v.state && this.synth) {


        // this.synth.triggerAttack(Tone.Frequency(v.note, "midi").toNote());


      } else if (this.synth) {
        // this.synth.triggerRelease(Tone.Frequency(v.note, "midi").toNote());
      }
    });

    this.keyboard.down(note => {
      if (note.note >= 0 && note.note <= 120) {

        this.piano.toggleKey(note.note, true);
      }
    });

    this.keyboard.up(note => {
      if (note.note >= 0 && note.note <= 120) {
        this.piano.toggleKey(note.note, false);
      }
    });

  }

  mute = (e) => {
    if (this.muted) {
      Tone.Master.mute = false;
      this.muted = false;
    } else {
      this.muted = true;
      Tone.Master.mute = true;
    }

  }


  selectHost = () => {

  }

  render() {
    return (
      <div className="App">
        <Button onClick={this.mute}>Mute</Button>
        <Button as={NavLink} to="/host">Host</Button>
        <p>
          Need to include:
        <br />
          <br />
          volume <br />
          note indicators <br />
          synth presets<br />

          <br />
          Want:
        <br />
          basic Fx
  
  
  
        </p>
        <Container style={{ 'padding': '0' }} fluid={true}>
          <Row noGutters={true}>

          </Row>
        </Container>
        <InfoDisplay />
        <PianoLayout keysReady={this.initPiano} playPiano={this.playPiano} />
      </div>
    )
  }
}

export default BasePage;

import React from 'react';
import { NavLink } from 'react-router-dom';
// import { TextButton, Dial } from 'react-nexusui';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import Tone, { Transport, Player, Part, Event } from 'tone';
import AudioKeys from 'audiokeys';

import { MusicRNN } from '@magenta/music';
import { presetMelodies } from '../utils/clips';

import * as Chord from "tonal-chord";

import * as api from '../api';
import PianoLayout from './PianoLayout';
import InfoDisplay from './InfoDisplay';
import ADSR from './ui-controllers/ADSR';



export class BasePage extends React.Component {

  // TODO
  // Improv RNN https://github.com/tensorflow/magenta/tree/master/magenta/models/improv_rnn
  // Drums https://github.com/tensorflow/magenta/tree/master/magenta/models/drums_rnn
  // 

  constructor(props) {
    super(props);

    api.openConnection();
    api.getID((id) => {
      this.setState({ clientID: id })
    })


    this.attack = 0.01;
    this.decay = 0.1;
    this.sustain = 0.5;
    this.release = 5;

    this.synth = new Tone.PolySynth(7, Tone.Synth, {
      "oscillator": {
        "type": "fatsawtooth",
        // "type": "triangle8",
        // "type": "square",
        "count": 1,
        "spread": 10,
      },
      "envelope": {
        "attack": this.attack,
        "decay": this.decay,
        "sustain": this.sustain,
        "release": this.release,
        "attackCurve": "linear"
      },
    }).toMaster();

    // this.synth = new Tone.PolySynth(8, Tone['Synth']).toMaster();

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



    this.state = {
      loadingModel: true,
      transpose: 0,
      temperature: 1,
      muted: false,
      currentChord: [],
      synth: this.synth,

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

  componentWillUnmount = () => {
    console.log('unmount');
    api.disconnectMe(this.state.isHost)
  }

  loadChordRNN = () => {
    const model = new MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
    model.initialize()
      .then(() => {
        console.log('chord model loaded!');
        this.setState({ loadingModel: false })
        this.model = model;
        api.announceModelReady();
      })
  }


  initChordRNN = (chordProgression) => {

    this.model.continueSequence(
      presetMelodies['Twinkle'],
      this.nOfBars * 16,
      0.8, // Temp
      chordProgression,
    ).then((i) => {
      this.setMelodies([i], chordProgression);
    });
  }


  setMelodies = (m, c) => {

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

    if (this.part) {
      this.part.stop();
    }

    this.part = new Tone.Part((time, value) => {

      if (!value.chord) {
        this.synth.triggerAttackRelease(Tone.Frequency(value.note).transpose(12 * this.state.transpose), "8n", time);

        let keyToToggle = Tone.Frequency(value.note).transpose(12 * this.state.transpose).toMidi();

        if (keyToToggle >= 0 && keyToToggle <= 120) {
          this.piano.toggleKey(keyToToggle, true);
          setTimeout(() => { this.piano.toggleKey(keyToToggle, false); }, 120);
        }
      } else {
        const notes = value.note.map(n => n + '3');
        console.log(value.note);
        this.setState({ currentChord: value.note })

        this.comp.triggerAttackRelease(notes, '1m', time, 1.0);

        notes.forEach(note => {
          let keyToToggle = Tone.Frequency(note).toMidi()
          if (keyToToggle >= 0 && keyToToggle <= 120) {
            this.piano.toggleKey(keyToToggle, true)
            setTimeout(() => { this.piano.toggleKey(keyToToggle, false); }, 1200);
          }
        });
      }

    }, notes);

    this.part.loop = 1;
    this.part.loopEnd = `${this.nOfBars}:0:0`;

    console.log(notes);
    // this.part.start();

    api.announceNotesReady();
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
        // console.log(note.note, this.synth);

        console.log(Tone.Frequency(note.note, "midi").toNote());
        
        this.synth.triggerAttack(Tone.Frequency(note.note, "midi").toNote());
      }
    });

    this.keyboard.up(note => {
      if (note.note >= 0 && note.note <= 120) {
        this.piano.toggleKey(note.note, false);
        
        
        this.synth.triggerRelease(Tone.Frequency(note.note, "midi").toNote());
      }
    });

  }

  mute = () => {
    if (this.state.muted) {
      Tone.Master.mute = false;
      this.setState({ muted: false })
    } else {
      Tone.Master.mute = true;
      this.setState({ muted: true })
    }
  }

  transposeUp = () => {
    if (this.state.transpose < 8) {
      this.setState({ transpose: this.state.transpose + 1 })
    }
  }

  transposeDown = () => {
    if (this.state.transpose > -8) {
      this.setState({ transpose: this.state.transpose - 1 })
    }
  }

  transposeReset = () => {
    this.setState({ transpose: 0 })
  }

  tempUp = () => {
    if (this.state.temperature < 2) {
      this.setState({ temperature: Math.round((this.state.temperature + 0.1) * 10) / 10 })
    }
  }

  tempDown = () => {
    if (this.state.temperature > 0.1) {
      this.setState({ temperature: Math.round((this.state.temperature - 0.1) * 10) / 10 })
    }
  }

  tempReset = () => {
    this.setState({ temperature: 1 })
  }


  selectHost = () => {

  }

  ADSRChange = (updates) => {
    
    console.log(updates);

    
    this.synth.voices.forEach(voice => {
      voice.envelope.attack = updates.attack;
      voice.envelope.decay = updates.decay;
      voice.envelope.sustain = updates.sustain;
      voice.envelope.release = updates.release;

    })   
  }

  render() {
    return (
      <div className="App">

        <Button as={NavLink} to="/host">Pick me as host</Button>
        <h1>Player</h1>
        {this.state.clientID && <h6>Connected. ClientID: {this.state.clientID}</h6>}


        <p></p>


        <Container fluid={true} style={{ 'margin': '0' }}>
        <Row>
          <Col>
            <Row noGutters={true} style={{ 'padding': '0 0 1em 0' }}>
              <Button variant="outline-primary" style={{ 'margin': '0 1em 0 1em' }} active={!this.state.muted} onClick={this.mute}>
                {this.state.muted ? 'Muted' : 'Mute'}
              </Button>
            </Row>

            <Row noGutters={true} style={{ 'padding': '0 0 1em 0' }}>
              <ButtonGroup style={{ 'padding': '0 1em 0 1em' }} aria-label="Basic example">
                <Button onClick={this.transposeReset} variant="secondary">Reset</Button>
                <Button onClick={this.transposeUp} variant="secondary">+</Button>
                <Button onClick={this.transposeDown} variant="secondary">-</Button>
              </ButtonGroup>
              <h4 >Transpose oct: {(this.state.transpose <= 0 ? "" : "+") + this.state.transpose}</h4>

            </Row>

            <Row noGutters={true} style={{ 'padding': '0 0 1em 0' }}>
              <ButtonGroup style={{ 'padding': '0 1em 0 1em' }} aria-label="Basic example">
                <Button onClick={this.tempReset} variant="secondary">Reset</Button>
                <Button onClick={this.tempUp} variant="secondary">+</Button>
                <Button onClick={this.tempDown} variant="secondary">-</Button>
              </ButtonGroup>
              <h4  >Temperature: {this.state.temperature}</h4>
            </Row>
          </Col>
          <Col>
            <Row style={{ 'padding': '0 0 1em 0' }}>
              
              <ADSR
              title='Amplitude Env'
              radius={15}
              onChange={this.ADSRChange}
            />
            </Row>
          </Col>
      </Row>
        </Container>

        <Container style={{ 'padding': '0' }} fluid={true}>
          <Row noGutters={true}>
            <p>Chord: {JSON.stringify(this.state.currentChord)}</p>
            
          </Row>
        </Container>

        <PianoLayout keysReady={this.initPiano} playPiano={this.playPiano} />
      </div>
    )
  }
}

export default BasePage;

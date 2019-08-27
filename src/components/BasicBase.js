import React from 'react';
import { NavLink } from 'react-router-dom';
// import { TextButton, Dial } from 'react-nexusui';
import { Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';
import Tone, { Transport } from 'tone';
import AudioKeys from 'audiokeys';

import { MusicRNN } from '@magenta/music';
import { presetMelodies } from '../utils/clips';

import * as Chord from "tonal-chord";

import * as api from '../api';
import PianoLayout from './PianoLayout';
// import InfoDisplay from './InfoDisplay';
import ADSR from './ui-controllers/ADSR';
import '../css/adsr.css';


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

    this.PrettoSlider = withStyles({
      root: {
        color: '#3888f5',
        height: 8,
      },
      thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -7,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
          boxShadow: 'inherit',
        },
      },
      active: {},
      valueLabel: {
        left: 'calc(-50% + 4px)',
      },
      track: {
        height: 12,
        borderRadius: 4,
      },
      rail: {
        height: 8,
        borderRadius: 4,
      },
    })(Slider);


    this.attack = 0.01;
    this.decay = 0.1;
    this.sustain = 0.5;
    this.release = 5;

    this.synth = new Tone.PolySynth(7, Tone.Synth, {
      "oscillator": {
        "type": "square",
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
    this.nOfBars = 16;

    this.state = {
      loadingModel: true,
      transpose: 0,
      temperature: 1,
      muted: false,
      currentChord: [],
      synth: this.synth,
      volume: -20
    }


    this.synth.volume.value = -20;





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
    api.disconnectMe(this.state.isHost)
  }

  loadChordRNN = () => {
    const modelCheckPoint = process.env.PUBLIC_URL + '/checkpoints/chord_pitches_improv';
    const model = new MusicRNN(modelCheckPoint);
    model.initialize()
      .then(() => {
        console.log('chord model loaded');
        this.setState({ loadingModel: false })
        this.model = model;
        api.announceModelReady();
      })
  }

  initChordRNN = (chordProgression) => {
    this.model.continueSequence(
      presetMelodies['Twinkle'],
      this.nOfBars * 16,
      this.state.temperature, // Temp
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

    api.announceNotesReady();
  }

  blurAll() {
    var tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
  }

  oscTypeChange = (e) => {
    this.synth.voices.forEach(voice => {
      voice.oscillator.type = e.target.value;
    })
    let xOff = window.pageXOffset;
    let yOff = window.pageYOffset

    this.blurAll();
    window.scrollTo(xOff, yOff);
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

        // console.log(Tone.Frequency(note.note, "midi").toNote());

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

  handleSliderChange = (event, newValue) => {
    this.setState({ volume: newValue })
    this.synth.volume.value = newValue;
  };

  ADSRChange = (updates) => {

    this.synth.voices.forEach(voice => {
      voice.envelope.attack = updates.attack;
      voice.envelope.decay = updates.decay;
      voice.envelope.sustain = updates.sustain;
      voice.envelope.release = updates.release;
      voice.volume.value = this.state.volume - updates.ampMaxValPerc;
    })
  }

  render() {
    return (
      <div className="App">
        <Button style={{ 'position': 'absolute', 'top': '8px', 'right': '100px' }} as={NavLink} to="/host">Pick me as host</Button>
        <Container fluid={true} style={{ 'margin': '0' }}>
          <Col style={{ 'maxWidth': '1000px', 'float': 'none', 'margin': '0 auto' }}>
            <Row style={{ 'marginTop': '0.8em' }}>
              <Col>
                <h1 style={{ 'marginBottom': '0.5em' }}>Playing</h1>
                {this.state.clientID && <h6>Connected <span role='img' aria-label='hang ten emoji'>&#x1F44C;</span> ClientID: {this.state.clientID}</h6>}
                {!this.state.clientID && <h6>Not Connected <span role='img' aria-label='thumbs down emoji'>&#x1f44e;</span></h6>}
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                <Row style={{ 'paddingBottom': '0.8em' }}>
                  <h6 style={{ 'margin': '0 1em 0 1em' }}>Volume: {this.state.volume} dB</h6>
                  <this.PrettoSlider
                    style={{ 'margin': '0 10em 0 1em' }}
                    value={this.state.volume}
                    onChange={this.handleSliderChange}
                    max={0}
                    min={-50}
                  />
                </Row>
                <Row style={{ 'paddingBottom': '3em' }}>
                  <Button size='sm' variant="outline-primary" style={{ 'margin': '0 1em 0 1.15em' }} active={!this.state.muted} onClick={this.mute}>
                    {this.state.muted ? 'Muted' : 'Mute'}
                  </Button>
                </Row>

                <Row style={{ 'paddingBottom': '0.5em' }}>
                  <ButtonGroup size='sm' style={{ 'padding': '0 1em 0 1em' }} aria-label="Basic example">
                    <Button onClick={this.transposeReset} variant="secondary">Reset</Button>
                    <Button onClick={this.transposeUp} variant="secondary">+</Button>
                    <Button onClick={this.transposeDown} variant="secondary">-</Button>
                  </ButtonGroup>
                  <h6 style={{ 'paddingTop': '0.25em' }} >Transpose oct: {(this.state.transpose <= 0 ? "" : "+") + this.state.transpose}</h6>

                </Row>
                <Row style={{ 'paddingBottom': '0.5em' }}>
                  <ButtonGroup size='sm' style={{ 'padding': '0 1em 0 1em' }} aria-label="Basic example">
                    <Button onClick={this.tempReset} variant="secondary">Reset</Button>
                    <Button onClick={this.tempUp} variant="secondary">+</Button>
                    <Button onClick={this.tempDown} variant="secondary">-</Button>
                  </ButtonGroup>
                  <h6 style={{ 'paddingTop': '0.25em' }}>Temperature: {this.state.temperature}</h6>
                </Row>
              </Col>
              <Col>
                <Row >
                  <Form.Label>Oscillator Type</Form.Label>
                  <Form.Control
                    as='select'
                    onChange={this.oscTypeChange}

                    style={{ 'width': '79%' }}
                  >
                    {this.generateOptions()}

                  </Form.Control>
                </Row>
                <Row style={{ 'padding': '1em 0 1em 0' }}>

                  <ADSR
                    title='Amplitude Env'
                    radius={15}
                    onChange={this.ADSRChange}
                  />
                </Row>
              </Col>
            </Row>
            <Row noGutters={true}>
              <p>Chord: {JSON.stringify(this.state.currentChord)}</p>

            </Row>
          </Col>
        </Container>

        <PianoLayout keysReady={this.initPiano} playPiano={this.playPiano} />
      </div>
    )
  }
}

export default BasePage;

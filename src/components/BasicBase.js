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


  // Score info
  // How long is left?
  // fiddle around with the osc types and ADSR

  constructor(props) {
    super(props);

    api.openConnection();
    api.getID((id, num) => {
      this.num = num;
      this.setState({ clientID: id, num, statusMessage: 'connected successfully' })

      //stagger this for each player
      // assume 2, want melody to be generated before 16th bar
      for (let i = 0; i < 3; i++) {

        Transport.schedule((time) => {
          console.log('loading at time ', time);
          
          this.setState({ statusMessage: `Thread Busy, constructing new melody` })
          this.model.continueSequence(
            this.melodies[this.melodies.length - 1],
            this.nOfBars * 16,
            this.state.temperature, // Temp
            this.chordInfo,
          ).then((m) => {
            this.addMelody(m, this.chordInfo);
            this.setState({ statusMessage: `added new melody ${this.melodiesIndex}` })
            console.log('melodies index', this.melodiesIndex);
          })
        }, `${(16 - this.num*3) * (i + 1)}:0:0`);

      }
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

    this.attack = 0.05;
    this.decay = 1.11;
    this.sustain = 0.5;
    this.release = 3.2;

    this.oscTypes = [
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

    let pickedSynth = this.oscTypes[Math.floor(Math.random() * this.oscTypes.length)];

    this.synth = new Tone.PolySynth(7, Tone.Synth, {
      "oscillator": {
        "type": pickedSynth,
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



    this.keyboard = new AudioKeys({
      polyphony: 8,
      rows: 1,
      priority: "last"
    });

    this.melodiesIndex = 0;
    this.melodies = [];
    this.parts = [];
    this.nOfBars = 16;
    this.sentReady = false;

    this.state = {
      loadingModel: true,
      transpose: 0,
      temperature: 1,
      muted: false,
      currentChord: [],
      synth: this.synth,
      volume: -20,
      chordVolume: -20,
      playChord: false,
      playAINotes: true,
      sentReady: false,
      pickedSynth: pickedSynth,
      timeInfo: 0,
    }

    this.synth.volume.value = -20;
    this.comp.volume.value = -20;

    // MIDI
    // https://codepen.io/Rumyra/pen/NxdbzL

    // start talking to MIDI controller
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess({
          sysex: false
        })
        .then(this.onMIDISuccess, this.onMIDIFailure);
    } else {
      console.warn("No MIDI support in your browser");
    }

    api.chordUpdate((chords, bpm) => {
      if (!this.state.loadingModel) {
        this.setState({ statusMessage: 'received chords, generating init melody 1' })
        this.chordInfo = chords;
        Transport.bpm.value = bpm;
        this.initChordRNN(chords)
      }
    })

    console.log(this.num);
    this.loadChordRNN();

    api.startPlaying((yesNo) => {
      api.subscribeToTime((err, timeInfo) => {

        if (timeInfo % 100 === 0 && timeInfo > 0) {
          Transport.seconds = timeInfo;
        }

        this.setState({ timeInfo });
      });
      if (yesNo) {
        if (Transport.seconds > 0) {
          Transport.stop();
        }

        this.setState({ statusMessage: `Playing Notes` })
        Transport.start();
      }
    })



  }

  // Stagger when new chrods are generated
  // Assign numeric id to each client to so this
  // Fix the ending time as a result (just stop transport at x time)
  // Fix the Transport position via a shared seconds clock count broadcast from the server
  // lmao javascript

  // on success
  onMIDISuccess = (midiData) => {
    // this is all our MIDI data
    this.midi = midiData;
    let allInputs = this.midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (
      let input = allInputs.next();
      input && !input.done;
      input = allInputs.next()
    ) {
      // when a MIDI value is received call the onMIDIMessage function
      input.value.onmidimessage = this.gotMIDImessage;
    }
  }
  // var dataList = document.querySelector('#midi-data ul')

  onMIDIFailure = () => {
    console.warn("Not recognising MIDI controller");
  }

  gotMIDImessage = (messageData) => {
    this.playNote(messageData.data);
  }

  playNote = (value) => {
    if (value[0] === 144 && value[2] !== 0) {
      this.piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), true);
      this.synth.triggerAttack(Tone.Frequency(value[1], "midi").toNote());
    } else if (value[0] === 144 || value[0] === 128) {
      this.piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), false);
      this.synth.triggerRelease(Tone.Frequency(value[1], "midi").toNote());
    }
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
        this.setState({ statusMessage: 'Music RNN loaded successfully, await host chords' })
      })
  }

  initChordRNN = (chordProgression) => {

    // Take twinkle twinkle and generate note sequence
    this.model.continueSequence(
      presetMelodies['Twinkle'],
      this.nOfBars * 16,
      this.state.temperature, // Temp
      chordProgression,
    ).then((i) => {

      this.addMelody(i, chordProgression);

      this.setState({ statusMessage: 'received chords, generating init melody 2' })
      // Take generated seq and feed it back in
      this.model.continueSequence(
        i,
        this.nOfBars * 16,
        this.state.temperature + 0.1, // Temp
        chordProgression,
      ).then((m) => {


        this.addMelody(m, chordProgression);
        this.setState({ statusMessage: 'melodies added, awaiting host start' })
        console.log('melodies index', this.melodiesIndex);

      })
    });
  }

  addMelody = (melody, chordProg) => {

    this.melodies.push(melody);

    let notes = this.melodies[this.melodiesIndex].notes.map(note => {
      const s = note.quantizedStartStep;
      return {
        'time': `${Math.floor(s / 16)}:${Math.floor(s / 4) % 4}:${(s % 4)}`,
        'note': Tone.Frequency(note.pitch, 'midi'),
        'isDrum': false,
        'chord': false,
      };
    });

    // add chrod progression to notes section
    if (chordProg) {
      this.chordProgression = chordProg;
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

    let part = this.createPart(notes)

    Transport.schedule((time) => {
      part.start()
      console.log('heloooo', Transport.position)
    }, `${this.melodiesIndex * 16}:0:0`);


    this.melodiesIndex++;

    if (this.melodiesIndex === 2 && !this.state.sentReady) {
      api.announceNotesReady();
      this.setState({ sentReady: true })
    }
  }

  createPart(notes) {
    let part = new Tone.Part((time, value) => {

      // console.log(Transport.position, Transport.ticks);

      if (!value.chord) {
        if (this.state.playAINotes) {
          this.synth.triggerAttackRelease(Tone.Frequency(value.note).transpose(12 * this.state.transpose), "16n", time);
        }

        let keyToToggle = Tone.Frequency(value.note).transpose(12 * this.state.transpose).toMidi();
        if (keyToToggle >= 0 && keyToToggle <= 120) {
          this.piano.toggleKey(keyToToggle, true);
          setTimeout(() => { this.piano.toggleKey(keyToToggle, false); }, 120);
        }
      } else {
        const notes = value.note.map(n => n + '3');

        this.setState({ currentChord: value.note })

        if (this.state.playChord) {
          this.comp.triggerAttackRelease(notes, '1m', time, 1.0);

          notes.forEach(note => {
            let keyToToggle = Tone.Frequency(note).toMidi()
            if (keyToToggle >= 0 && keyToToggle <= 120) {
              this.piano.toggleKey(keyToToggle, true)
              setTimeout(() => { this.piano.toggleKey(keyToToggle, false); }, 1200);
            }
          });
        }

      }

    }, notes);

    // // part.loop = 1;
    // // part.loopStart = `${this.nOfBars * this.melodiesIndex}:0:0`;
    // // part.loopEnd = `${this.nOfBars * (this.melodiesIndex + 1)}:0:0`;

    part.humanize = true;
    return part;
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
    let yOff = window.pageYOffset;

    this.blurAll();
    window.scrollTo(xOff, yOff);
    this.setState({ pickedSynth: e.target.value })
  }

  generateOptions = () => {
    let res = [];
    this.oscTypes.forEach((type) => {
      res.push(<option key={type} value={type} >{type}</option>)
    })

    return res;
  }

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

  handleChordSliderChange = (event, newValue) => {
    this.setState({ chordVolume: newValue })
    this.comp.volume.value = newValue;
  };

  ADSRChange = (updates) => {
    this.synth.voices.forEach(voice => {
      voice.envelope.attack = updates.attack;
      voice.envelope.decay = updates.decay;
      voice.envelope.sustain = updates.sustain;
      voice.envelope.release = updates.release;

    })
    this.synth.volume.value = this.state.volume - updates.ampMaxValPerc;
  }

  handlePlayChord = () => {
    if (this.state.playChord) {
      this.setState({ playChord: false })
    } else {
      this.setState({ playChord: true })
    }
  }

  handlePlayAINotes = () => {
    if (this.state.playAINotes) {
      this.setState({ playAINotes: false })
    } else {
      this.setState({ playAINotes: true })
    }
  }

  render() {
    return (
      <div className="App">
        <Button style={{ 'position': 'absolute', 'top': '8px', 'right': '100px' }} as={NavLink} to="/host">Pick me as host</Button>
        <Container fluid={true} style={{ 'margin': '0' }}>
          <Col style={{ 'maxWidth': '1000px', 'float': 'none', 'margin': '0 auto' }}>
            <Row style={{ 'marginTop': '0.8em' }}>
              <Col>
                <h1 style={{ 'marginBottom': '0.5em' }}>Player</h1>
                {this.state.clientID && <h6>Connected <span role='img' aria-label='hang ten emoji'>&#x1F44C;</span> ClientID: {this.state.clientID}</h6>}
                {!this.state.clientID && <h6>Not Connected <span role='img' aria-label='thumbs down emoji'>&#x1f44e;</span></h6>}
                {this.state.statusMessage && <h6>Status: {this.state.statusMessage}</h6>}
                <hr />
              </Col>
              <Col>
                <p>State: {this.state.timeInfo}</p>
                <p>Transport: {Transport.seconds}</p>
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

                <Row style={{ 'paddingTop': '3em' }}>
                  <Button size='sm' variant="outline-primary" style={{ 'margin': '0 1em 0 1.15em' }} active={this.state.playChord} onClick={this.handlePlayChord}>
                    {this.state.playChord ? 'Stop playing chord' : 'Play chords'}
                  </Button>


                </Row>
                {this.state.playChord &&
                  <Row>
                    <h6 style={{ 'margin': '1em 1em 0 1em' }}>Chord Volume: {this.state.chordVolume} dB</h6>
                    <this.PrettoSlider
                      style={{ 'margin': '0 10em 0 1em' }}
                      value={this.state.chordVolume}
                      onChange={this.handleChordSliderChange}
                      max={0}
                      min={-50}
                    />
                  </Row>}
                <Row style={{ 'paddingTop': '1em' }}>
                  <Button size='sm' variant="outline-primary" style={{ 'margin': '0 1em 0 1.15em' }} active={this.state.playAINotes} onClick={this.handlePlayAINotes}>
                    {this.state.playAINotes ? 'Stop playing AI Notes' : 'Play AI Notes'}
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row >
                  <Form.Label>Oscillator Type</Form.Label>
                  <Form.Control
                    as='select'
                    onChange={this.oscTypeChange}
                    value={this.state.pickedSynth}
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
            {this.state.sentReady &&
              <Row noGutters={true}>
                <div>
                  <p>Chord Prog:</p>
                  <p>C, Am, F, G, C, F, G, C, C, Am, F, G, C, F, G, C</p>
                </div>
              </Row>
            }

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

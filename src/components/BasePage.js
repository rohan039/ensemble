import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { TextButton, Dial } from 'react-nexusui';
import { Container, Row, Col, Button } from 'react-bootstrap';
import * as Tone from 'tone';
import AudioKeys from 'audiokeys';
import PianoLayout from './PianoLayout';
import SynthLayout from './SynthLayout';
import { FxContainer } from './FxContainer';

import InfoDisplay from './InfoDisplay';

export class BasePage extends React.Component {

  constructor(props) {
    super(props);

    this.synth = new Tone.PolySynth(8, Tone['Synth']).toMaster();

    this.keyboard = new AudioKeys({
      polyphony: 8,
      rows: 1,
      priority: "last"
    });

    this.muted = false;

    this.state = {
      synth: this.synth,
      poly: true,
      activeSynth: 'genericSynth',
      synthParams: {
        pluckSynth: {
          synthVolume: -3,
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.7
        },
        genericSynth: {
          volume: -6,
          oscType: 'triangle',
          ampMaxValPerc: 0,
          attack: -3,
          decay: 1,
          sustain: 4000,
          release: 0.7
        }
      }
    }
  }

  // playNote = (value) => {
  //   if (value[0] === 144 && value[2] != 0) {
  //     piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), true);
  //   } else if (value[0] === 144 || value[0] === 128) {
  //     piano.toggleKey(Tone.Frequency(value[1], "midi").toMidi(), false);
  //   }
  // }


  synthUpdate = (updates) => {

    let synth;

    switch (this.state.activeSynth) {
      case 'pluckSynth':

        this.setState({
          synthParams: {
            ...this.state.synthParams,
            pluckSynth: {
              ...this.state.synthParams.pluckSynth,
              ...updates
            }
          }
        });

        synth = this.state.synth;

        synth.volume.value = this.state.synthParams.pluckSynth.synthVolume;
        synth.attackNoise = this.state.synthParams.pluckSynth.attackNoise;
        synth.dampening.value = this.state.synthParams.pluckSynth.dampening;
        synth.resonance.value = this.state.synthParams.pluckSynth.resonance;


        
        this.setState({ synth });

        break;
      case 'genericSynth':

        this.setState({
          synthParams: {
            ...this.state.synthParams,
            genericSynth: {
              ...this.state.synthParams.genericSynth,
              ...updates
            }
          }
        });

        synth = this.state.synth;

        synth.voices.forEach(voice => {
          voice.oscillator.type = this.state.synthParams.genericSynth.oscType;
          voice.envelope.attack = this.state.synthParams.genericSynth.attack;
          voice.envelope.decay = this.state.synthParams.genericSynth.decay;
          voice.envelope.sustain = this.state.synthParams.genericSynth.sustain;
          voice.envelope.release = this.state.synthParams.genericSynth.release;
          voice.volume.value = this.state.synthParams.genericSynth.volume - this.state.synthParams.genericSynth.ampMaxValPerc;
        });
        
        // dB = 10 log(1 + X)

        this.setState({ synth });

        break;
      default:
        break;
    }
  }

  synthChange = (e) => {

    let xOff = window.pageXOffset;
    let yOff = window.pageYOffset

    this.blurAll();
    window.scrollTo(xOff, yOff);

    let synth = null;

    if (this.state.synth) {
      this.state.synth.disconnect();
      this.state.synth.dispose();
    }
    switch (e.target.value) {
      case 'AMSynth':

        synth = new Tone.PolySynth(8, Tone["AMSynth"]).toMaster();
        this.setState({ synth, activeSynth: 'AMSynth', poly: true });
        break;
      case 'duoSynth':
        synth = new Tone.PolySynth(8, Tone["DuoSynth"]).toMaster();
        this.setState({ synth, activeSynth: 'duoSynth', poly: true });
        break;
      case 'FMSynth':
        synth = new Tone.PolySynth(8, Tone["FMSynth"]).toMaster();
        this.setState({ synth, activeSynth: 'FMSynth', poly: true });
        break;
      case 'membraneSynth':
        synth = new Tone.MembraneSynth().toMaster();
        this.setState({ synth, activeSynth: 'membraneSynth', poly: false });
        break;
      case 'metalSynth':
        synth = new Tone.MetalSynth().toMaster();
        this.setState({ synth, activeSynth: 'metalSynth', poly: false });
        break;
      case 'monoSynth':
        synth = new Tone.PolySynth(8, Tone["MonoSynth"]).toMaster();
        this.setState({ synth, activeSynth: 'monoSynth', poly: true });
        break;
      case 'noiseSynth':
        synth = new Tone.NoiseSynth().toMaster();
        this.setState({ synth, activeSynth: 'noiseSynth', poly: false });
        break;
      case 'pluckSynth':
        synth = new Tone.PluckSynth().toMaster();
        this.setState({ synth, activeSynth: 'pluckSynth', poly: false });
        break;
      case 'genericSynth':
        synth = new Tone.PolySynth(8, Tone["Synth"]).toMaster();
        this.setState({ synth, activeSynth: 'genericSynth', poly: true });
        break;
      default:
        synth = null;
        this.setState({ synth, activeSynth: 'none' });
        break;
    }
  }

  initPiano = (piano) => {

    // piano.colorize("accent", "#a3ffbc");
    // piano.colorize("fill", "#a3ffbc");

    this.piano = piano;
    this.piano.on("change", v => {

      if (v.state && this.state.synth) {

        if (this.state.activeSynth === "metalSynth" ||
          this.state.activeSynth == "noiseSynth"
        ) {
          this.state.synth.triggerAttack();
        } else {
          this.state.synth.triggerAttack(Tone.Frequency(v.note, "midi").toNote());
        }

      } else if (this.state.synth && this.state.poly) {
        this.state.synth.triggerRelease(Tone.Frequency(v.note, "midi").toNote());
      } else {
        this.state.synth.triggerRelease();
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

  

  render() {
    return (
      <div className="App">
        <Button onClick={this.mute}>Mute</Button>
        <Container style={{ 'padding': '0' }} fluid={true}>
          <Row noGutters={true}>
            <Col >
              <SynthLayout synthParams={this.state.synthParams} activeSynth={this.state.activeSynth} synthUpdate={this.synthUpdate} synthChange={this.synthChange} />
            </Col>
            <Col >
              <FxContainer />
            </Col>
          </Row>
        </Container>
        <InfoDisplay />
        <PianoLayout keysReady={this.initPiano} playPiano={this.playPiano} />
      </div>
    )
  }
}

export default BasePage;

import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { TextButton, Dial } from 'react-nexusui';
import { Container, Row, Col } from 'react-bootstrap';
import PianoLayout from './PianoLayout';
import { SynthLayout } from './SynthLayout';
import { FxContainer } from './FxContainer';
import * as Tone from 'tone';

export class BasePage extends React.Component {

  constructor(props) {
    super(props);

    this.synth = new Tone.Synth().toMaster()

    this.pluckSynth = new Tone.PluckSynth().toMaster();

    this.state = {
      synth: this.synth,
      activeSynth: 'none',
      synthParams: {
        pluckSynth: {
          synthVolume: -3,
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.7
        }
      }
    }
  }

  synthUpdate = (updates) => {

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
        
        let synth = this.state.synth;

        synth.volume.value = this.state.synthParams.pluckSynth.synthVolume;
        synth.attackNoise = this.state.synthParams.pluckSynth.attackNoise;
        synth.dampening.value = this.state.synthParams.pluckSynth.dampening;
        synth.resonance.value = this.state.synthParams.pluckSynth.resonance;

        this.setState({ synth });

        break;
      default:
        break;
    }
  }

  synthChange = (e) => {
    let synth = null;
    switch (e.value) {
      case 'AM Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.AMSynth();
        this.setState({ synth, activeSynth: 'AMSynth' });
        break;
      case 'Duo Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.DuoSynth().toMaster();
        this.setState({ synth, activeSynth: 'duoSynth' });
        break;
      case 'FM Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.FMSynth().toMaster();
        this.setState({ synth, activeSynth: 'FMSynth' });
        break;
      case 'Membrane Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.MembraneSynth().toMaster();
        this.setState({ synth, activeSynth: 'membraneSynth' });
        break;
      case 'Metal Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.MetalSynth().toMaster();
        this.setState({ synth, activeSynth: 'metalSynth' });
        break;
      case 'Mono Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.MonoSynth().toMaster();
        this.setState({ synth, activeSynth: 'monoSynth' });
        break;
      case 'Noise Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.NoiseSynth().toMaster();
        this.setState({ synth, activeSynth: 'noiseSynth' });
        break;
      case 'Pluck Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.PluckSynth().toMaster();
        this.setState({ synth, activeSynth: 'pluckSynth' });
        break;
      case 'Generic Synth':
        if (this.state.synth) {
          this.state.synth.disconnect();
          this.state.synth.dispose();
        }
        synth = new Tone.Synth().toMaster();
        this.setState({ activeSynth: 'basicSynth' });
        break;
      default:
        break;
    }
  }

  

  render() {
    return (
      <div className="App">
        <Container style={{ 'padding': '0' }}fluid={true}>
          <Row noGutters={true}>
            <Col >
              <SynthLayout synthParams={this.state.synthParams} activeSynth={this.state.activeSynth} synthUpdate={this.synthUpdate} synthChange={this.synthChange} />
            </Col>
            <Col >
              <FxContainer />
            </Col>
          </Row>
        </Container>
        <PianoLayout synth={this.state.synth} />
      </div>
    )
  }
}

export default BasePage;

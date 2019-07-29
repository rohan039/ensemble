import React from 'react';
import { connect } from 'react-redux';
import { PluckSynth } from './synths/PluckSynth';
// import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Select } from 'react-nexusui';
// import { googleLogin } from '../actions/auth';
// import { Button, Form, Icon, Segment, Divider, Label } from 'semantic-ui-react';
// import { isEmail } from 'validator';
// import { firebase } from '../firebase/firebase';

export class SynthLayout extends React.Component {

  constructor(props) {
    super(props);

    this.synthOptions = [
      'AM Synth',
      'Duo Synth',
      'FM Synth',
      'Membrane Synth',
      'Metal Synth',
      'Mono Synth',
      'Noise Synth',
      'Pluck Synth',
      'Generic Synth'
    ];

    this.state = {
      activeSynth: 'none',
    }
  }

  // handleSelect = (e) => {
    
  //       this.props.synthChange('basicSynth');
      
  // }

  pluckUpdate = (e) => {

    this.props.synthUpdate({
      synthVolume: e.synthVolume,
      attackNoise: e.attackNoise,
      dampening: e.dampening,
      resonance: e.resonance,
    });
  }

  render() {

    let selectedSynth = null;
    switch (this.props.activeSynth) {
      case 'pluckSynth':
        selectedSynth = <PluckSynth defaults={this.props.defaults.pluckSynth} onChange={this.pluckUpdate} />
        break;
      case 'AMSynth':
        selectedSynth = <p>AM</p>
        break;
      case 'duoSynth':
        selectedSynth = <p>duoSynth</p>
        break;
      case 'FMSynth':
        selectedSynth = <p>FMSynth</p>
        break;
      case 'membraneSynth':
        selectedSynth = <p>membraneSynth</p>
        break;
      case 'metalSynth':
        selectedSynth = <p>metalSynth</p>
        break;
      case 'monoSynth':
        selectedSynth = <p>monoSynth</p>
        break;
      case 'noiseSynth':
        selectedSynth = <p>noiseSynth</p>
        break;
      case 'basicSynth':
        selectedSynth = <p>basicSynth</p>
        break;
      case 'none':
        selectedSynth = <p>None selected</p>
        break;
      default:
        selectedSynth = <p>None selected</p>
        break;
    }

    return (
      <div style={{ 'background': '#84a5db' }}>
        Synth Controller
        <Select options={this.synthOptions} onChange={this.props.synthChange} />

        {selectedSynth}

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  // googleLogin: () => dispatch(googleLogin())
});

export default connect(undefined, mapDispatchToProps)(SynthLayout);





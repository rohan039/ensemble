import React from 'react';
import { connect } from 'react-redux';
import PluckSynth from './synths/PluckSynth';
import { Select } from 'react-nexusui';

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

  pluckUpdate = (updates) => {    
    this.props.synthUpdate(updates);
  }

  render() {

    let selectedSynth = null;
    switch (this.props.activeSynth) {
      case 'pluckSynth':
        selectedSynth = <PluckSynth synthParams={this.props.synthParams.pluckSynth} onChange={this.pluckUpdate} />
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
      default:
        selectedSynth = <p>None selected</p>
        break;
    }

    return (
      <div style={{ 'background': '#84a5db' }}>
        <h3>Synth Controller</h3>
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





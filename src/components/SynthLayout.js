import React from 'react';
import { Form } from 'react-bootstrap';
import PluckSynth from './synths/PluckSynth';
import AMSynth from './synths/AMSynth';
import DuoSynth from './synths/DuoSynth';
import FMSynth from './synths/FMSynth';
import MembraneSynth from './synths/MembraneSynth';
import MetalSynth from './synths/MetalSynth';
import MonoSynth from './synths/MonoSynth';
import NoiseSynth from './synths/NoiseSynth';
import BasicSynth from './synths/BasicSynth';

const SynthLayout = (props) => {

  let selectedSynth = null;
  switch (props.activeSynth) {
    case 'pluckSynth':
      selectedSynth = <PluckSynth synthParams={props.synthParams.pluckSynth} onChange={props.synthUpdate} />
      break;
    case 'AMSynth':
      selectedSynth = <AMSynth />
      break;
    case 'duoSynth':
      selectedSynth = <DuoSynth />
      break;
    case 'FMSynth':
      selectedSynth = <FMSynth />
      break;
    case 'membraneSynth':
      selectedSynth = <MembraneSynth />
      break;
    case 'metalSynth':
      selectedSynth = <MetalSynth />
      break;
    case 'monoSynth':
      selectedSynth = <MonoSynth />
      break;
    case 'noiseSynth':
      selectedSynth = <NoiseSynth />
      break;
    case 'genericSynth':
      selectedSynth = <BasicSynth onChange={props.synthUpdate} />
      break;
    default:
      selectedSynth = <p>None selected</p>
      break;
  }

  return (
    <div style={{ 'background': '#84a5db' }}>
      <h3>Synth Controller</h3>
      
      <Form.Group controlId="formControlsSelect">
        
        <Form.Control
          as='select'
          onChange={props.synthChange}
        >
          <option value='AMSynth'>AM Synth</option>
          <option value='duoSynth'>Duo Synth</option>
          <option value='FMSynth'>FM Synth</option>
          <option value='membraneSynth'>Membrane Synth</option>
          <option value='metalSynth'>Metal Synth</option>
          <option value='monoSynth'>Mono Synth</option>
          <option value='noiseSynth'>Noise Synth</option>
          <option value='pluckSynth'>Pluck Synth</option>
          <option value='genericSynth'>Generic Synth</option>
        </Form.Control>
      </Form.Group>
      
      {selectedSynth}

    </div>
  )
}


export default SynthLayout;





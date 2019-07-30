import React from 'react';
import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
import Knob from '../Knob'
import '../../css/synth-base.css'

const PluckSynth = (props) => {

  const volChange = (synthVolume) => {
    props.onChange({ synthVolume });
  };

  const attackChange = (attackNoise) => {
    props.onChange({ attackNoise });
  }

  const dampeningChange = (dampening) => {
    props.onChange({ dampening });
  }

  const resonanceChange = (resonance) => {
    props.onChange({ resonance });
  }

  return (
    <div style={{ 'background': 'grey', 'color': 'white' }}>
      <h3 style={{ 'padding': '0.5em' }} >Pluck Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <Knob
              className='knob-group'
              size={40}
              numTicks={20}
              degrees={340}
              min={-50}
              max={0}
              value={props.synthParams.synthVolume}
              onChange={volChange}
            />
            <Number
              className={'knob-group'}
              value={props.synthParams.synthVolume}
              min={-50}
              max={0}
              onChange={volChange}
              size={[50, 20]}
            />
            <p>Volume</p>
          </Col>
          <Col>
            <Knob
              className={'knob-group'}
              size={40}
              numTicks={20}
              degrees={340}
              min={0.1}
              max={20}
              value={props.synthParams.attackNoise}
              onChange={attackChange}
            />
            <Number
              className={'knob-group'}
              value={props.synthParams.attackNoise}
              min={0.1}
              max={20}
              onChange={attackChange}
              size={[50, 20]}
            />
            <p>Attack Noise</p>
          </Col>
          <Col>
            <Knob
              className={'knob-group'}
              size={40}
              numTicks={20}
              degrees={340}
              min={0}
              max={10000}
              value={props.synthParams.dampening}
              onChange={dampeningChange}
            />
            <Number
              className={'knob-group'}
              value={props.synthParams.dampening}
              min={0}
              max={10000}
              onChange={dampeningChange}
              size={[50, 20]}
            />
            <p>Dampening</p>
          </Col>
          <Col>
            <Knob
              className={'knob-group'}
              size={40}
              numTicks={20}
              degrees={340}
              min={0}
              max={15000}
              value={props.synthParams.resonance}
              onChange={resonanceChange}
            />
            <Number
              className={'knob-group'}
              value={props.synthParams.resonance}
              min={0}
              max={15000}
              onChange={resonanceChange}
              size={[50, 20]}
            />
            <p>Resonance</p>
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default PluckSynth;






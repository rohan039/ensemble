import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'

const MembraneSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  return (
    <div style={{ 'background': 'LightBlue', 'color': 'black' }}>
      <h3 style={{ 'padding': '0.5em' }} >Membrane Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <p>Volume</p>
          </Col>
          <Col>
            <p>pitchDecay</p>
          </Col>
          <Col>
            <p>octaves</p>
          </Col>
        </Row>
        <Row noGutters={true}>
          <p>Oscillator type</p>
          <p>partials</p>
        </Row>
        <Row noGutters={true}>
        </Row>
      </Container>

    </div>
  );
}

export default MembraneSynth;






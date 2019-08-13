import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'

const AMSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  return (
    <div style={{ 'background': 'orange', 'color': 'black' }}>
      <h3 style={{ 'padding': '0.5em' }} >AM Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <p>Volume</p>
          </Col>
          <Col>
            <p>Harmonicity</p>
          </Col>
          <Col>
            <p>Detune</p>
          </Col>
        </Row>
        <Row noGutters={true}>
          <p>Oscillator type</p>
          <p>partials</p>
        </Row>
        <Row noGutters={true}>
          <p>Envelope ASDR</p>
        </Row>
        <Row noGutters={true}>
          <p>Modulation type</p>
        </Row>
      </Container>

    </div>
  );
}

export default AMSynth;






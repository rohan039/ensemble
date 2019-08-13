import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'

const FMSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  return (
    <div style={{ 'background': 'GreenYellow', 'color': 'black' }}>
      <h3 style={{ 'padding': '0.5em' }} >FM Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <p>Volume</p>
          </Col>
          <Col>
            <p>harmonicity</p>
          </Col>
          <Col>
            <p>Modulation Index</p>
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
          <p>ENV ASDR</p>
        </Row>
        <Row noGutters={true}>
          <p>Modulation</p>
          <p>partials</p>
        </Row>
        <Row noGutters={true}>
          <p>MOD ENV ASDR</p>
        </Row>
      </Container>

    </div>
  );
}

export default FMSynth;






import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'

const MonoSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  return (
    <div style={{ 'background': 'Thistle', 'color': 'black' }}>
      <h3 style={{ 'padding': '0.5em' }} >Mono Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <p>Volume</p>
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
          <p>Filter Q</p>
        </Row>
        <Row noGutters={true}>
          <p>ENV ASDR</p>
        </Row>
        <Row noGutters={true}>
          <p>Filter ENV ASDR</p>
          <p>filter env baseFrequency</p>
          <p>filter env octaves</p>
          <p>filter env exponent</p>
        </Row>
      </Container>

    </div>
  );
}

export default MonoSynth;






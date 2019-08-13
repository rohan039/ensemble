import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'

const MetalSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  return (
    <div style={{ 'background': 'Peru', 'color': 'black' }}>
      <h3 style={{ 'padding': '0.5em' }} >Metal Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <p>Volume</p>
          </Col>
          <Col>
            <p>frequency</p>
          </Col>
        </Row>
        
        <Row noGutters={true}>
          <p>ENV ASDR</p>
        </Row>
        <Row noGutters={true}>
          <p>harmonicity</p>
          <p>modulationIndex</p>
          <p>resonance</p>
          <p>octaves</p>
        </Row>
      </Container>

    </div>
  );
}

export default MetalSynth;






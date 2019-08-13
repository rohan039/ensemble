import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'

const NoiseSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  return (
    <div style={{ 'background': 'DimGrey', 'color': 'white' }}>
      <h3 style={{ 'padding': '0.5em' }} >Noise Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <p>Volume</p>
          </Col>
        </Row>
        <Row noGutters={true}>
          <p>Noise type</p>
        </Row>
        <Row noGutters={true}>
          <p>ENV ASD</p>
        </Row>
      </Container>

    </div>
  );
}

export default NoiseSynth;






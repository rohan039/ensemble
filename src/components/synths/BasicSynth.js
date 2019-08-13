import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'
import ASDR from '../ui-controllers/ASDR';

const BasicSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  const asdrUpdate = (positions) => {
    console.log(positions);
    
  }

  return (
    <div style={{ 'background': 'blue', 'color': 'white' }}>
      <h3 style={{ 'padding': '0.5em' }} >Basic Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <p>Volume</p>
          </Col>
        </Row>
        <Row noGutters={true}>
          <p>Oscillator type</p>
          <p>partials</p>
        </Row>
        <Row noGutters={true}>
          <ASDR
            radius={15}
            onChange={asdrUpdate}
          />
        </Row>
      </Container>

    </div>
  );
}

export default BasicSynth;






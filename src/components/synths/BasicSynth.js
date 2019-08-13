import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'
import ADSR from '../ui-controllers/ADSR';

const BasicSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  const adsrUpdate = (adsrVals) => {
    console.log(adsrVals);
    
  }

  return (
    <div style={{ 'background': 'grey', 'color': 'white' }}>
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
          <ADSR
            radius={15}
            onChange={props.onChange}
          />
        </Row>
      </Container>

    </div>
  );
}

export default BasicSynth;






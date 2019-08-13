import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'

const DuoSynth = (props) => {

  // const volChange = (synthVolume) => {
  //   props.onChange({ synthVolume });
  // };

  return (
    <div style={{ 'background': 'DarkOrchid', 'color': 'black' }}>
      <h3 style={{ 'padding': '0.5em' }} >Duo Synth</h3>
      <Container>
        <Row noGutters={true}>
          <Col>
            <p>Volume</p>
          </Col>
          <Col>
            <p>vibratoAmount</p>
          </Col>
          <Col>
            <p>vibratoRate</p>
          </Col>
          <Col>
            <p>harmonocity</p>
          </Col>
        </Row>
        <Row noGutters={true}>
          <h3>Voice 1</h3>
          <p>Volume</p>
          <p>type</p>
          <p>filterEnv ASDR</p>
          <p>env ASDR</p>
        </Row>
        <Row noGutters={true}>
          <h3>Voice 2</h3>
          <p>Volume</p>
          <p>type</p>
          <p>filterEnv ASDR</p>
          <p>env ASDR</p>
        </Row>

      </Container>

    </div>
  );
}

export default DuoSynth;






import React from 'react';
// import { Number } from 'react-nexusui';
import { Container, Col, Row, Form } from 'react-bootstrap';
// import Knob from '../ui-controllers/Knob'
import '../../css/synth-base.css'
import ADSR from '../ui-controllers/ADSR';

import Slider from '@material-ui/core/Slider';

class BasicSynth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sliderVal: 100,
    };
  }

  blurAll() {
    var tmp = document.createElement("input");
    document.body.appendChild(tmp);
    tmp.focus();
    document.body.removeChild(tmp);
  }

  generateOptions = () => {
    let oscTypes = [
      "square",
      "sine",
      "triangle",
      "sawtooth",
      "pwm",
      "pulse",
      "fatsquare",
      "fatsine",
      "fattriangle",
      "fatsawtooth",
      "fmsquare",
      "fmsine",
      "fmtriangle",
      "fmsawtooth",
      "amsquare",
      "amsine",
      "amtriangle",
      "amsawtooth"
    ]

    let res = [];
    oscTypes.forEach((type) => {
      res.push(<option key={type} value={type} >{type}</option>)
    })

    return res;
  }

  synthTypeChange = (e) => {
    this.blurAll();
    this.props.onChange({ oscType: e.target.value })
  }

  sliderChange = (e, sliderVal) => {

    this.setState({ sliderVal })

    
  }

  render() {
    return (
      <div style={{ 'background': 'grey', 'color': 'white' }}>
        <h3 style={{ 'padding': '0.5em' }} >Basic Synth</h3>
        <Container>
          <Row noGutters={true}>
            <Col>
              <p>Volume</p>
            </Col>
            <Slider value={this.state.sliderVal} onChange={this.sliderChange} />
          </Row>
          <Row noGutters={true}>
            <Form.Label>Oscillator Type</Form.Label>
            <Form.Control
              as='select'
              onChange={this.synthTypeChange}
            >
              {this.generateOptions()}

            </Form.Control>
          </Row>
          <Row noGutters={true}>
            <ADSR
              title='Amplitude Env'
              radius={15}
              onChange={this.props.onChange}
            />
          </Row>
        </Container>
      </div>
    );
  }
}

export default BasicSynth;






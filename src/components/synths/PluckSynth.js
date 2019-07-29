import React from 'react';
import { connect } from 'react-redux';
import { Number } from 'react-nexusui';
import { Container, Col, Row } from 'react-bootstrap';
import Knob from '../Knob'

export class PluckSynth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      synthVolume: this.props.defaults.synthVolume,
      attackNoise: this.props.defaults.attackNoise,
      dampening: this.props.defaults.dampening,
      resonance: this.props.defaults.resonance,
    }
  }

  volChange = (synthVolume) => {
    this.setState({ synthVolume });
    this.props.onChange(this.state);
  };

  attackChange = (attackNoise) => {
    this.setState(() => ({ attackNoise }));
    this.props.onChange(this.state);
  }

  dampeningChange = (dampening) => {
    this.setState(() => ({ dampening }));
    this.props.onChange(this.state);
  }

  resonanceChange = (resonance) => {
    this.setState(() => ({ resonance }));
    this.props.onChange(this.state);
  }

  render() {
    return (
      <div style={{ 'background': 'grey', 'color': 'white' }}>
        <h3>Pluck Synth</h3>
        <Container>
          <Row>
            <Col>
              <Knob
                size={40}
                numTicks={20}
                degrees={340}
                min={-50}
                max={0}
                value={this.state.synthVolume}
                onChange={this.volChange}
              />
              <Number
                value={this.state.synthVolume}
                min={-50}
                max={0}
                onChange={this.volChange}
                size={[50, 20]}
              />
              <p>Volume</p>
            </Col>
            <Col>
              <Knob
                size={40}
                numTicks={20}
                degrees={340}
                min={0.1}
                max={20}
                value={this.state.attackNoise}
                onChange={this.attackChange}
              />
              <Number
                value={this.state.attackNoise}
                min={0.1}
                max={20}
                onChange={this.attackChange}
                size={[50, 20]}
              />
              <p>Attack Noise</p>
            </Col>
            <Col>
              <Knob
                size={40}
                numTicks={20}
                degrees={340}
                min={0}
                max={10000}
                value={this.state.dampening}
                onChange={this.dampeningChange}
              />
              <Number
                value={this.state.dampening}
                min={0}
                max={10000}
                onChange={this.dampeningChange}
                size={[50, 20]}
              />
              <p>Dampening</p>
            </Col>
            <Col>
              <Knob
                size={40}
                numTicks={20}
                degrees={340}
                min={0}
                max={15000}
                value={this.state.resonance}
                onChange={this.resonanceChange}
              />
              <Number
                value={this.state.resonance}
                min={0}
                max={15000}
                onChange={this.resonanceChange}
                size={[50, 20]}
              />
              <p>Resonance</p>
            </Col>
          </Row>
        </Container>

      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  // googleLogin: () => dispatch(googleLogin())
});

export default connect(undefined, mapDispatchToProps)(PluckSynth);





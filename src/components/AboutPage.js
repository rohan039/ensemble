import React from 'react';

import { Container, Row, Col} from 'react-bootstrap';
import '../css/adsr.css';


export class BasePage extends React.Component {

  // TODO
  // Improv RNN https://github.com/tensorflow/magenta/tree/master/magenta/models/improv_rnn
  // Drums https://github.com/tensorflow/magenta/tree/master/magenta/models/drums_rnn
  // 

  

    
  // 192.168.20.64

  render() {
    return (
      <div className="App">
        <Container fluid={true} style={{ 'margin': '0' }}>
          <Col style={{ 'maxWidth': '1000px', 'float': 'none', 'margin': '0 auto' }}>
            <Row style={{ 'marginTop': '0.8em' }}>
              <Col>
                <h1 style={{ 'marginBottom': '0.5em' }}>About</h1>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
               <p> This is the about page, information about what this is goes here</p>
              </Col>
              
              
            </Row>
           
          </Col>
        </Container>
      </div>
    )
  }
}

export default BasePage;

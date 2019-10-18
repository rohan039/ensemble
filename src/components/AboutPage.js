import React from 'react';

import { Container, Row, Col} from 'react-bootstrap';
import '../css/adsr.css';


export class BasePage extends React.Component {

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
                
               <p>TODO: Provide some background once I've written it in my thesis.</p>
              </Col>
              
              
            </Row>
           
          </Col>
        </Container>
      </div>
    )
  }
}

export default BasePage;

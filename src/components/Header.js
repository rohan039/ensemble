import React from 'react';
// import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
// import { startLogout } from '../actions/auth';
// import { Container, Menu, Button, Icon } from 'semantic-ui-react'
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';

export const Header = ({ startLogout }) => (
  <div>
    <Navbar bg="dark" variant="dark" expand="md">
      <Navbar.Brand href="#home">Working Title</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

// <Form inline>
//           <FormControl type="text" placeholder="Search" className="mr-sm-2" />
//           <Button variant="outline-success">Search</Button>
//         </Form>

const mapDispatchToProps = (dispatch) => ({
  // startLogout: () => dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(Header);
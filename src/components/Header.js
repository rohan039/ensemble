import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

export const Header = () => (
  <div>
    <Navbar bg="dark" variant="dark" expand="md">
      <Navbar.Brand href="#home"><span aria-label='piano emoji' role='img'>&#x1F3B9;</span> </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/base">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
         
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);

export default Header;
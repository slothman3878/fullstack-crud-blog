import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import {
  Container,
  Button
} from 'react-bootstrap';

const Navi=()=>{
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Crud Blog</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#">About</Nav.Link>
            <Nav.Link href="#">Type 1</Nav.Link>
            <Nav.Link href="#">Type 2</Nav.Link>
          </Nav>
          <Nav className="justify-content-end">
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navi;
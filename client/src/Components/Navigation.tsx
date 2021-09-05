import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button'

const Navi=()=>{
  return (
    <Navbar bg="light" expand="lg">
  <Container>
    <Navbar.Brand href="/">StreamerCo.in</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="#">About</Nav.Link>
        <Nav.Link href="#">Search Stars</Nav.Link>
        <Nav.Link href="#">StarSwap</Nav.Link>
      </Nav>
      <Nav className="justify-content-end">
        <Nav.Link href="#">Sign In</Nav.Link>
        <Button variant="outline-primary">Wallet</Button>{' '}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
  )
}

export default Navi;
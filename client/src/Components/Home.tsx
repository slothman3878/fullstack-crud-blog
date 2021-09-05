import React from "react";
import { Container, Button } from "react-bootstrap";

const Home=()=>{
  return (
    <div className="base">
    <Container style = {{marginTop: "50px"}}>
      <div className="title">
        <h1>Crud Blog</h1>
      </div>
      <div>
        <Button variant='primary' href='/auth/google'>auth</Button>
      </div>
    </Container>
    </div>
  );
}

export default Home;

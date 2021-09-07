import {
  useEffect,
  useState,
} from "react";
import { 
  Container, 
  Button,
} from "react-bootstrap";
import {
  Redirect
} from 'react-router-dom';

import Navi from './NavigationBar';

const Home=()=>{
  return (
    <div className="base">
      <Navi/>
      <Container style = {{marginTop: "50px"}}>
        <div className="title">
          <h1>Sloth Man's Corner</h1>
        </div>
        <a href='http://localhost:5000/auth/google'> auth </a>
      </Container>
    </div>
  );
}

export default Home;

import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./components/SigningForm";
import "./App.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

import SigningForm from "./components/SigningForm";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">         
          <Navbar.Brand 
          width="30"
          height="30"
          className="d-inline-block align-top"
          href="/"
          >
            SCRIVE SIGNATURE
          </Navbar.Brand>
        </Navbar>
        <Container>
          <SigningForm />
        </Container>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";

import SigningForm from "./components/SigningForm";
import "./components/SigningForm";


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

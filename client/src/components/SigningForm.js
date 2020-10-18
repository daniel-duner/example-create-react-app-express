import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


class SigningForm extends Component {
  state = {
    selectedFile: null,
    parties: [],
    partyFields: 0,
    response: ""
  };

  fileInputHandler = (e) => {
    this.setState({selectedFile: e.target.files[0],});
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.startSigningProcess();
  };

  postCall = async (url, data, config) => {
    try {
      return await axios.post(url, data, config);
    } catch (error) {
      console.log(error);
    }
  };

  startSigningProcess = async () => {
    try {
      this.setState({ response: "File was uploaded, adding parties..." });
      let response = await this.startSigningProcess();
      console.log(response)
      this.setState({status: response.status, statusText: response.statusText});
    } catch (error) {
      console.log(error);
    }
  };

  startSigningProcess = async () => {
    const url = "/api/document/start";
    let parties = [];
    this.state.parties.map((party) => {
      const { type, value } = party;
      parties = [...parties, { fields: [{ type, value }] }];
    });
    const data = new FormData();
    data.append("file", this.state.selectedFile);
    data.append("signingParties", JSON.stringify(parties));
    const config = {
      headers: {
        "content-type": `multipart/form-data;boundary=${data._boundary}`,
      },
    };
    return this.postCall(url, data, config);
  };
  
  addPartyField = (e) => {
    e.preventDefault();
    const { partyFields } = this.state;
    this.setState((prevState) => {
      return {
        partyFields: partyFields + 1,
        parties: [...prevState.parties, { type: "email", value: "" }]      };
    });
  };

  handleChange = (e, index) => {
    const { type, value } = e.target;
    const parties = [...this.state.parties];
    console.log(index);
    parties[index].value = value;
    this.setState({
      parties: parties,
    });
  };

  renderPartyFields = () => {
    return this.state.parties.map((party, index) => {
      console.log(party);
      return (
        <Form.Group
          controlId={index}
          key={index}
          controlId="exampleForm.ControlInput1"
          style={{ width: "300px" }}
        >
          <Form.Label>{`Party ${index + 2}`}</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="name@example.com"
            onChange={(e) => this.handleChange(e, index)}
          />
        </Form.Group>
      );
    });
  };

  render() {
    return (
      <Form style={{ marginTop: "100px" }}>        
        <Form.Group>
          <input type="file" name="file" onChange={this.fileInputHandler} />
        </Form.Group>
        {this.renderPartyFields()}
        <Form.Group>
          <Button
            variant="dark"
            type="button"
            size="ls"
            onClick={this.addPartyField}
          >
            Add Party
          </Button>{" "}
        </Form.Group>
    
        <Form.Group>
          <Button
            variant="dark"
            type="submit"
            size="ls"
            onClick={this.handleSubmit}
          >
            Start Signing
          </Button>{" "}
        </Form.Group>
        <p>{this.state.response}</p>
      </Form>
    );
  }
}

export default SigningForm;

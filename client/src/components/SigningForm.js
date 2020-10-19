import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FileUploader from "./FileUploader";

class SigningForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedFile: null,
      parties: [{email: ""}],
      partyFields: 1,
      response: "",
      emailIsValid: false,
      fileName: null,
      session: Math.random()
    };
  }
  
  //Changes input from fileInput
  fileInputHandler = (file) => {
    this.setState({selectedFile: file, fileName: file.name, error: null});
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if(this.state.selectedFile != null){
      await this.startSigningProcess();
    } else{
      this.messageHandler("No file");
    }
  };

  //creates appropriate response messages to client
  messageHandler(message){
    if(message === "Invalid email address"){
      this.setState({error: message, response: null});
    } else if(message === "Success!"){
      this.setState({error: null, response: "Success! Signing process has started, check your email"});
    } else if(message == "No file"){
      this.setState({error: "Select a file", response: null});
    }
  }
  
  //changes party
  partyInputHandler = (e, index) => {
    const { value } = e.target;
    const parties = [...this.state.parties];
    parties[index].email = value;
    this.setState({
      parties: parties,
    });
  };

  //adds party field information to state
  addPartyField = (e) => {
    e.preventDefault();
    const { partyFields } = this.state;
    this.setState((prevState) => {
      return {
        partyFields: partyFields + 1,
        parties: [...prevState.parties, {email: ""}]
       };
    });
  };

  startSigningProcess = async () => {
    try{
      this.setState({response: "Starting signing process", error: null});
      const url = "/api/documents/start";
      const formData = new FormData();
      this.state.parties.forEach((party) => {
        const { email } = party;
        formData.append('emails', email);
      });
      formData.append("file", this.state.selectedFile);
      const config = {
        headers: {
          "content-type": `multipart/form-data;boundary=${formData._boundary}`,
        },
      };
      const response = await axios.post(url, formData, config);
      console.log("response");
      this.setState({selectedFile: null, fileName: null, parties: [{email:""}], partyFields: 1, session: Math.random()});
      this.messageHandler(response.data);
    }catch(error){
      this.messageHandler(error.response.data);
    }
  };

  //a randomised session is added for unique key, so that they will rerender properly
  renderPartyFields = () => {
    return this.state.parties.map((party, index) => {
      return (
        <Form.Group
          controlId={`${party}+${index}`}
          key={`${index}+${this.state.session}`}
          style={{ width: "300px" }}
        >
          <Form.Label>{`Party ${index + 2}`}</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="name@example.com"
            onChange={(e) => this.partyInputHandler(e, index)}
          />
        </Form.Group>
      );
    });
  };

  render() {
    return (
      <Form style={{ marginTop: "100px" }}>        
        <Form.Group>
          <FileUploader 
          name="Choose File" 
          handleFile={this.fileInputHandler}          
          />
          {this.state.fileName ? <p>{`File: ${this.state.fileName}`}</p> : <p></p>}
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
        <p style={{color: "red", fontWeight: "bold"}}>{this.state.error}</p>
        <p style={{color: "green", fontWeight: "bold"}}>{this.state.response}</p>
      </Form>
    );
  }
}

export default SigningForm;

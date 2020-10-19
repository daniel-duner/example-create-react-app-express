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
  
  postCall = async (url, data, config) => {
    return await axios.post(url, data, config);
  };
  
  fileInputHandler = (file) => {
    this.setState({selectedFile: file, fileName: file.name, error: null});
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if(this.state.selectedFile != null){
      await this.startSigningProcess();
    } else{
      this.setState({error: "Select a file", response: null})
    }
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
      const response = await this.postCall(url, formData, config);
      this.setState({selectedFile: null, fileName: null, parties: [{email:""}], partyFields: 1, session: Math.random()})
      this.setState({response: response.data, error: null});
    }catch(error){
      this.errorMessageHandler(error.response.data);
    }
  };

  errorMessageHandler(error){
    if(error === "Invalid email address"){
      this.setState({error: error, response: null});
    }
  }

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

  inputHandler = (e, index) => {
    const { value } = e.target;
    const parties = [...this.state.parties];
    parties[index].email = value;
    this.setState({
      parties: parties,
    });
  };

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
            onChange={(e) => this.inputHandler(e, index)}
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
          ref={this.hiddenFileInput} 
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
        <p>{this.state.error}</p>
        <p>{this.state.response}</p>
      </Form>
    );
  }
}

export default SigningForm;

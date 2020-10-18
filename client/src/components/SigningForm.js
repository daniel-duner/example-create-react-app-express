import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class SigningForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedFile: null,
      parties: [{email: ""}],
      partyFields: 1,
      response: "",
      emailIsValid: false
    };
  }
  componentDidMount(){
  }
  
  postCall = async (url, data, config) => {
    return await axios.post(url, data, config);
  };
  
  fileInputHandler = (e) => {
    this.setState({selectedFile: e.target.files[0],});
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if(this.state.selectedFile != null){
      await this.startSigningProcess();
    } else{
      this.setState({response: "Select a file"})
    }
  };

  startSigningProcess = async () => {
    try{
      this.setState({response: "Starting signing process"});
      const url = "/api/documents/start";
      const formData = new FormData();
      this.state.parties.map((party) => {
        const { email } = party;
        formData.append('email', email);
      });
      formData.append("file", this.state.selectedFile);
      const config = {
        headers: {
          "content-type": `multipart/form-data;boundary=${formData._boundary}`,
        },
      };
      const response = this.postCall(url, formData, config);
      this.setState({response: response.status});
    }catch(error){
      console.log(error)
      this.setState({response: error});
      console.log(error)
    }
  };
  
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
          key={index}
          controlId=""
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

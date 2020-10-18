import React, { Component } from "react";
import axios from "axios";

import "./App.css";

class App extends Component {
  state = {
    selectedFile: null,
    parties: [{}],
    partyFields: 1
  };

  componentDidMount() {
  }

  onChangeHandler = (e) => {
   this.setState({
        selectedFile: e.target.files[0]
      },()=>console.log(this.state.selectedFile)
      )   
    };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.startSigningProcess(this.state.selectedFile);
  };

  startSigningProcess = async (file) => {
    const url = "/api/documents/new";
    const data = new FormData();
    console.log(data);
    data.append("file", file);
    const config = {
      headers: {
        "content-type": `multipart/form-data;boundary=${data._boundary}`,
      },
    };
    try {
      const response = await axios.post(url, data, config);
      const { id, parties } = response.data;
      console.log(response.data.id, response.data.parties);
      this.updateParty(id, parties);
    } catch (error) {
      console.log(error);
    }
  };

  updateParty = async (id, parties) => {
    const url = "/api/documents/update";
    const data = {
      id: id,
      parties: [...parties, {fields: [{type: "email", value: "noreply@scrive.com",}]}],
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };
    try {
      const response = await axios.post(url, data, config);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  render() {
    return (
      <div className="App">
        <header className="App-header">SCRIVE SIGNATURE</header>
        <form>
          <input type="file" name="file" onChange={this.onChangeHandler} />
          <button type="submit" onClick={this.handleSubmit} >
            Start Signing
          </button>
          <button type="submit" onClick={this.addPartyField}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default App;

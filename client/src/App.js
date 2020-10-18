import React, { Component } from "react";
import axios from "axios";

import "./App.css";

class App extends Component {
  state = {
    selectedFile: null,
    parties: [],
    partyFields: 0
  };
  componentDidMount() {}

  onChangeHandler = (e) => {
    this.setState({
        selectedFile: e.target.files[0]
      });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.startSigningProcess();
  };

  postCall = async (url, data, config) => {
    try{
      return await axios.post(url, data, config);
    } catch (error) {
      console.log(error);
    } 
  }

  startSigningProcess = async () => {
    try {
      let response = await this.createDocument();
      const {id, parties} = response.data;
      response = this.updateParty(id, parties);
      this.startSigning(id);
    } catch (error) {
      console.log(error);
    }
  };

  startSigning = async (id) =>{
    const url = "/api/documents/start";
    const data = {id};
    const config = {
      headers: {
        "content-type": 'application/json'
      },
    };
    return this.postCall(url, data, config);
  }

  createDocument = async () => {
    const url = "/api/documents/new";
    const data = new FormData();
    data.append("file", this.state.selectedFile);
    const config = {
      headers: {
        "content-type": `multipart/form-data;boundary=${data._boundary}`,
      },
    };
    return this.postCall(url, data, config);
  }

  updateParty = async (id, ownerParty) => {
    const url = "/api/documents/update";
    console.log(parties)
    let parties = [...ownerParty];
    this.state.parties.map((party)=>{
      const {type, value} = party;
      parties = [...parties, {fields: [{type, value}]}]
    })
    console.log(parties)
    const data = {
      id,
      parties
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return this.postCall(url, data, config);
    try {
      const response = await axios.post(url, data, config);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  addPartyField = (e) => {
    e.preventDefault();
    const {partyFields} = this.state
    this.setState((prevState) => {
      return {
        partyFields: partyFields+1,
        parties: [...prevState.parties, {type:"email", value: ""}]
      };
    }, console.log(this.state.parties));
  };

  handleChange = (e, index) => {
    const {type, value} = e.target;
    const parties = [...this.state.parties];
    console.log(index)
    parties[index].value = value;
    this.setState({
      parties: parties
    });
  };

  renderPartyFields = () => {
    return(
    this.state.parties.map((party, index )=>{
      console.log(party);
      return(
        <input
          key={index}
          type="text"
          name="email"
          placeholder={`email party ${(index+2)}`}
          value={this.state.parties[index].value}
          onChange={ e => this.handleChange(e, index)}
        />
      )
    })
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">SCRIVE SIGNATURE</header>
        <form>
          <input type="file" name="file" onChange={this.onChangeHandler} />
          {this.renderPartyFields()}
          <button type="submit" onClick={this.handleSubmit}>
            Start Signing
          </button>
          <button type="submit" onClick={this.addPartyField}>
            Add Parties
          </button>
        </form>
      </div>
    );
  }
}

export default App;

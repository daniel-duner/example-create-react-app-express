import Button from "react-bootstrap/Button";
import React, {Component} from "react";

class FileUploader extends Component{
  constructor(props){
    super(props);
    this.hiddenFileInput = React.createRef();
  }
  handleClick = (event) => {
    this.hiddenFileInput.current.click();
  };
  
  handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    this.props.handleFile(fileUploaded);
  };

  render(){
      return (
        <>
          <Button
            variant="dark"
            type="button"
            size="ls"
            onClick={this.handleClick}
          >
            {this.props.name}
          </Button>{" "}
          <input
            type="file"
            ref={this.hiddenFileInput}
            onChange={this.handleChange}
            style={{ display: "none" }}
          />
        </>
      );
    };
  }

export default FileUploader;

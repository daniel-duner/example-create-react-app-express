import React, {Component} from 'react';
import Button from 'react-bootstrap/Button'

class Button extends Component{
    handleClick = (e) => {
        e.preventDefault();
        this.fileUpload(this.state.selectedFile).then((response)=>{
        console.log(response.data);
    })
    }
    fileUpload(file){
        const url = '/api/v2/documents/new';
        const data = new FormData();
        data.append('file',file)
        const config = {
            headers: {
                'content-type': `multipart/form-data;boundary=${data._boundary}`
            }
        }
        return  axios.post(url, data, config)
      }
    render(){
        return (
            <Button 
                variant="Success"
                size="lg"
                onClick={this.handleClick}
            >
                Start Signing
            </Button>
        );
    };
}

export default Button;
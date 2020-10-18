import React, {Component} from 'react';
import Form from 'react-bootstrap/Form'

class PartyField extends Component{
    render(){
        return (
            <Form.Group controlId={this.props.controlId}>
                <Form.Label>{this.props.label}</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    onChange={this.props.handleChange}
                    value={this.props.value}
                />
                <Form.Text className={this.props.className}>
                    {this.props.text}
                </Form.Text>
            </Form.Group>
        );
    };
}

export default PartyField;
import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import PartyField from './PartField.js';
import './PartyField.js'

class SigningForm extends Component{

    renderPartyFields = (controllId, label, handleChange, value, className, text) => {
        return(
            <PartyField
            controllId={controllId}
            label={label}
            handleChange={handleChange}
            value={value}
            className={className}
            text={text}
            />
        )
    }

    render(){
        return (
            <Form> 
                
            </Form>
        );
    };
}

export default SigningForm;
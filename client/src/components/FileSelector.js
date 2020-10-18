import React, {Component} from 'react';
import './Button';

class Button extends Component{
    render(){
        return (
            <Button 
            type={this.props.type}
            variant={this.props.variant} 
            size={this.props.size}
            onClick={this.props.handleClick}
            >
            {this.props.btn_text}
            </Button>
        );
    };
}

export default Button;
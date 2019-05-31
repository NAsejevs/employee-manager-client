import React from "react";
import { Form } from "react-bootstrap";

class BoostrapDatePicker extends React.Component {
    render() {
        return (
            <Form.Control
                disabled={this.props.disabled}
                onClick={this.props.onClick}
                onChange={this.props.onChange}
                placeholder={this.props.value} 
                value={this.props.value}
                className="text-center"
            />
        );
    }
}

export default BoostrapDatePicker;

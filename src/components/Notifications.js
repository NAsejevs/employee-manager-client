import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

import { hideNotifications } from "../actions/employeeActions";

class Notifications extends React.Component {
	constructor(props) {
        super(props);
        
        console.log("hello world!!");
	}

	onHide = () => {
		this.props.hideNotifications();
	}

	render() {
		return (
			<Modal 
				show={this.props.notifications.show}
				onHide={() => this.onHide()}
			>
				<Modal.Header closeButton>
					<Modal.Title>Paziņojumi</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					
				</Modal.Body>

				<Modal.Footer>
					
				</Modal.Footer>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		notifications: state.employees.notifications,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		hideNotifications: () => dispatch(hideNotifications()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Notifications);

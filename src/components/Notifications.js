import React from "react";
import { connect } from "react-redux";
import { Modal, Alert } from "react-bootstrap";

import { hideNotifications } from "../actions/employeeActions";

class Notifications extends React.Component {
	constructor(props) {
        super(props);
	}

	componentDidUpdate() {
		console.log(this.props.notifications.data);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.employees.length > 0) {
			return true;
		}
		return false;
	}

	displayNotifications = () => {
		return this.props.notifications.data.map((notification) => {
			const notificationData = JSON.parse(notification.data);

			switch(notification.type) {
				case "EMPLOYEE_LATE": {
					const employee = this.props.employees.find((employee) => employee.id === notificationData.id);

					return (
						<Alert key={notification.id} variant={"danger"}>
							<b>{employee.surname + " " + employee.name}</b> - Darba kavējums
						</Alert>
					);
				}
				default: {
					return (
						<Alert key={notification.id}>
							Nezināms ieraksts
						</Alert>
					);
				}
			}
		})
	}

	onHide = () => {
		this.props.hideNotifications();
	}

	render() {
		return (
			<Modal 
				size="lg"
				show={this.props.notifications.show}
				onHide={() => this.onHide()}
			>
				<Modal.Header closeButton>
					<Modal.Title>Paziņojumi</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{this.displayNotifications()}
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
		employees: state.employees.employees,
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

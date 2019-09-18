import React from "react";
import { connect } from "react-redux";
import { Modal, Alert, Button, Row, Col } from "react-bootstrap";

import { hideNotifications, showEmployeeWorkLog } from "../actions/employeeActions";

import { addNotification } from "../utils/employeeUtils";
import { formatDate } from "../utils/commonUtils";

class Notifications extends React.Component {
	constructor(props) {
        super(props);
	}

	componentDidMount() {
		window.addNotification = (type, data) => {
			addNotification(type, data);
		}
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

					if(employee) {
						return (
							<Alert 
								key={notification.id} 
								variant={"danger"}
								dismissible
							>
								<Row>
									<Col>
										<Button
											variant="link"
											onClick={() => this.props.showEmployeeWorkLog(employee.id)}
											className="pl-0"
										>
											{employee.surname + " " + employee.name}
										</Button>
									</Col>
									<Col className="d-flex flex-column justify-content-center">
										<span className="text-center">
											<b>DARBA KAVĒJUMS</b>
										</span>
									</Col>
									<Col className="d-flex flex-column justify-content-center">
										<span className="flex-right text-right">
											{formatDate(notification.date)}
										</span>
									</Col>
								</Row>
								<hr className="m-0"/>
								<Row className="pt-1">
									<Col className="d-flex flex-column justify-content-center">
										<span>
											Ienācis: {employee.working ? "JĀ" : "NĒ"}
										</span>
									</Col>
									<Col className="d-flex flex-column justify-content-center">
										{
											employee.working 
											? (
												<span className="text-right">
													Ieradās: {employee.working ? formatDate(employee.last_work_start) : formatDate(employee.last_work_end)}
												</span>
											)
											: null
										}
									</Col>
								</Row>
							</Alert>
						);
					}
					break;
				}
				default: {
					return (
						null
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
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Notifications);

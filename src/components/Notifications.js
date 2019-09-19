import React from "react";
import { connect } from "react-redux";
import { Modal, Alert, Button, Row, Col } from "react-bootstrap";

import BoostrapDatePicker from "./BoostrapDatePicker";

import { hideNotifications, showEmployeeWorkLog } from "../actions/employeeActions";

import { addNotification } from "../utils/employeeUtils";
import { formatDate } from "../utils/commonUtils";

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			notifications: [],
			notificationDate: new Date(),
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.notificationDate !== this.state.notificationDate ||
			prevProps.notifications !== this.props.notifications) {
			this.setState({
				notifications: this.props.notifications.data.filter(notification => {
					const notificationDate = new Date(notification.date);
					return notificationDate.getFullYear() === this.state.notificationDate.getFullYear() &&
						notificationDate.getMonth() === this.state.notificationDate.getMonth() &&
						notificationDate.getDate() === this.state.notificationDate.getDate();
				})
			});
		}
	}

	displayNotifications = () => {
		const notifications = this.state.notifications.map((notification) => {
			const notificationData = JSON.parse(notification.data);

			switch(notification.type) {
				case "EMPLOYEE_LATE": {
					const employee = this.props.employees.find((employee) => employee.id === notificationData.id);

					if(employee) {
						return (
							<Alert 
								key={notification.id} 
								variant={"danger"}
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
							</Alert>
						);
					}
					return null;
				}
				default: {
					return null;
				}
			}
		});

		if(notifications.filter(notification => notification != null).length === 0) {
			return (
				<h2 style={{ color: "grey" }} className="text-center">
					Nav ierakstu...
				</h2>
			);
		}
		return notifications;
	}

	onChangeNotificationDate = (date) => {
		this.setState({
			notificationDate: date,
		});
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
					<Modal.Title className="w-100">Paziņojumi</Modal.Title>
					<BoostrapDatePicker
						dateFormat="dd.MM.yyyy."
						selected={new Date(this.state.notificationDate)}
						onChange={this.onChangeNotificationDate}
						maxDate={new Date()}
					/>
				</Modal.Header>

				<Modal.Body>
					<Row>
						<Col>
							{this.displayNotifications()}
						</Col>
					</Row>
				</Modal.Body>
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

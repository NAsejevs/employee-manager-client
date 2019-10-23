import React from "react";
import { connect } from "react-redux";
import { Modal, Alert, Button, Row, Col } from "react-bootstrap";

import BoostrapDatePicker from "./BoostrapDatePicker";

import { showProcessNotification, hideProcessNotification, hideNotifications, showEmployeeWorkLog } from "../actions/employeeActions";

import { addNotification, getServerEmployeeWorkLog } from "../utils/employeeUtils";
import { formatDate } from "../utils/commonUtils";

class NotificationsNew extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			notifications: [],
			notificationDate: new Date(),
			processedNotifications: [],
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

	processNotifications = () => {
		const notifications = this.state.notifications.map((notification) => {
			const notificationData = JSON.parse(notification.data);

			switch(notification.type) {
				case "EMPLOYEE_LATE": {
					const employee = this.props.employees.find((employee) => employee.id === notificationData.id);
					let showedUp = false;
					let showedUpDate = null;	

					if(employee) {
						const notificationDate = new Date(notification.date);
						return getServerEmployeeWorkLog(employee.id).then((res) => {
							const workLogs = res.data;
							workLogs.forEach(workLog => {
								const workLogDate = new Date(workLog.start_time);
								if(workLogDate.getDate() === notificationDate.getDate() &&
								workLogDate.getMonth() === notificationDate.getMonth() &&
								workLogDate.getFullYear() === notificationDate.getFullYear()) {
									showedUp = true;
									showedUpDate = workLogDate;
								}
							});

							const ShowedUp = () => {
								if(showedUp) {
									return <div>Ieradās: {formatDate(showedUpDate)}</div>
								} else {
									return <div><i>Nav ieradies</i></div>
								}
							}

							return (
								<Alert 
									key={notification.id} 
									variant={"danger"}
									className="p-1"
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
									<Row>
										<Col>
										</Col>
										<Col className="d-flex flex-row justify-content-center">
											<Button 
												variant="success"
												className="mr-1"
												size="sm"
												onClick={() => this.props.showProcessNotification(notification)}
											>
												Attaisnots
											</Button>
											<Button
												variant="warning"
												className="ml-1"
												size="sm"
												onClick={() => this.props.showProcessNotification(notification)}
											>
												Neattaisnots
											</Button>
										</Col>
										<Col className="d-flex flex-column justify-content-center">
											<span className="flex-right text-right">
												<ShowedUp/>
											</span>
										</Col>
									</Row>
								</Alert>
							);
						});
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
		
		return Promise.all(notifications).then((data) => {
			this.setState({
				processedNotifications: data,
			});
		});
	}

	onChangeNotificationDate = (date) => {
		this.setState({
			notificationDate: date,
		});
	}

	onHide = () => {
		this.props.hideNotifications();
	}

	onShow = () => {
		this.processNotifications();
	}

	render() {
		return (
			<Modal 
				size="lg"
				show={this.props.notifications.show}
				onHide={() => this.onHide()}
				onShow={() => this.onShow()}
			>
				<Modal.Header closeButton>
					<Modal.Title className="w-100">Paziņojumi</Modal.Title>
					<Button
						onClick={() => console.log("opening history...")}
						className="mr-2"
					>
						Vēsture
					</Button>
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
							{this.state.processedNotifications}
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
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id)),
		showProcessNotification: (notification) => dispatch(showProcessNotification(notification)),
		hideProcessNotification: () => dispatch(hideProcessNotification()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NotificationsNew);

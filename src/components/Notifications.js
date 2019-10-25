import React from "react";
import { connect } from "react-redux";
import { Modal, Alert, Button, Row, Col } from "react-bootstrap";

import BoostrapDatePicker from "./BoostrapDatePicker";

import { 
	showProcessNotification, 
	hideProcessNotification, 
	hideNotifications, 
	showEmployeeWorkLog
} from "../actions/employeeActions";

import { getServerEmployeeWorkLogFromTo } from "../utils/employeeUtils";
import { formatDate } from "../utils/commonUtils";

import ProcessNotification from "./ProcessNotification";

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			notifications: [],
			notificationDate: new Date(),
			processedNotifications: [],

			showHistory: false,
			historyNotifications: [],
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.notificationDate !== this.state.notificationDate ||
			JSON.stringify(prevProps.notifications) !== JSON.stringify(this.props.notifications)) {
			console.log("setting stat");
			console.log("notifications: ", this.props.notifications);
			this.setState({
				notifications: this.props.notifications.notifications.filter(notification => {
					const notificationDate = new Date(notification.date);
					return notificationDate.getFullYear() === this.state.notificationDate.getFullYear() &&
						notificationDate.getMonth() === this.state.notificationDate.getMonth() &&
						notificationDate.getDate() === this.state.notificationDate.getDate();
				})
			}, () => {
				this.processNotifications();
				console.log("length: ", this.state.notifications.length);
			});
		}
	}

	processHistoryNotifications = () => {
		const notifications = this.state.notifications.map((notification) => {
			return (
				<div>
					{notification.type}
				</div>
			);
		});
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
						const fromDate = notificationDate;
						fromDate.setHours(0, 0, 0, 0);
						const toDate = notificationDate;
						toDate.setHours(24, 0, 0, 0);
						return getServerEmployeeWorkLogFromTo(employee.id, fromDate, toDate).then((res) => {
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
			this.setState({
				processedNotifications: (
					<h2 style={{ color: "grey" }} className="text-center">
						Nav ierakstu...
					</h2>
				),
			});
			return;
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

	showHistory = () => {
		this.setState({
			showHistory: true
		}, () => {
			this.processHistoryNotifications();
		});
	}

	hideHistory = () => {
		this.setState({
			showHistory: false
		}, () => {
			this.processNotifications();
		});
	}

	render() {
		return (
			<>
				<ProcessNotification/>
				<Modal 
					size="lg"
					show={this.props.notifications.show}
					onHide={() => this.onHide()}
					onShow={() => this.onShow()}
				>
					<Modal.Header closeButton>
						<Modal.Title className="w-100">Paziņojumi</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Row className="mb-3">
							<Col>
								<span className="d-inline">
									{"Datums: "}
								</span>
								<BoostrapDatePicker
									className="d-inline-block text-center"
									dateFormat="dd.MM.yyyy."
									selected={new Date(this.state.notificationDate)}
									onChange={this.onChangeNotificationDate}
									maxDate={new Date()}
									dayClassName={(date) => {
											for(let i = 0; i < this.props.notifications.notifications.length; i++) {
												const notificationDate = new Date(this.props.notifications.notifications[i].date);
												if(notificationDate.getDate() === date.getDate() &&
													notificationDate.getMonth() === date.getMonth() &&
													notificationDate.getFullYear() === date.getFullYear() &&
													!this.props.notifications.notifications[i].type.includes("LOG")) {
													return "highlighted-date";
												}
											}
											return null;
										}
									}
								/>
							</Col>
							<Col>
								<Button
									onClick={() => this.state.showHistory ? this.hideHistory() : this.showHistory()}
									className="float-right"
								>
									{this.state.showHistory ? "Neapstrādātie paziņojumi" : "Apstrādātie paziņojumi"}
								</Button>
							</Col>
						</Row>
						<Row>
							<Col>
								<span style={{ fontSize: "12px" }}>
									* Kalendārā sarkani iekrāsoti datumi ar neapstrādātiem paziņojumiem.
								</span>
							</Col>
						</Row>
						<hr/>
						<Row className="mt-3">
							<Col>
								{this.state.showHistory ? this.state.historyNotifications : this.state.processedNotifications}
							</Col>
						</Row>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}

function mapStateToProps(state) {
	return {
		notifications: state.employees.notifications,
		processedNotifications: state.processedNotifications,
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
)(Notifications);

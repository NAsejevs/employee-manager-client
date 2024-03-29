import React from "react";
import { connect } from "react-redux";
import { Modal, Alert, Row, Col } from "react-bootstrap";

import BoostrapDatePicker from "./BoostrapDatePicker";

import { hideHistory, showEmployeeWorkLog } from "../actions/employeeActions";

import { formatDate, addZero } from "../utils/commonUtils";
import * as LOG_TYPE from "../utils/logTypes";

class History extends React.Component {
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
				notifications: this.props.notifications.notifications.filter(notification => {
					const notificationDate = new Date(notification.date);
					return notificationDate.getFullYear() === this.state.notificationDate.getFullYear() &&
						notificationDate.getMonth() === this.state.notificationDate.getMonth() &&
						notificationDate.getDate() === this.state.notificationDate.getDate();
				})
			});
		}
	}

	history = (notification, notificationData, employee) => {
		let logTypeTranslated = notification.type;
		switch(notification.type) {
			case LOG_TYPE.LOG_EDIT_WORK_LOG: {
				const formatTime = (date) => {
					const dateParsed = JSON.parse(date);
					if(dateParsed === null) {
						return "neizgājis";
					}
					const dateObject = new Date(dateParsed);
					return addZero(dateObject.getHours()) + ":" +
						addZero(dateObject.getMinutes()) + ":" +
						addZero(dateObject.getSeconds());
				}

				const from = notificationData.from;
				const to = notificationData.to;
				
				logTypeTranslated = (<div>
					{"izmainīts darba laiks"}<br/>
					<div style={{ fontSize: "12px" }}>
						No: {formatTime(from.startDate)} - {formatTime(from.endDate)}<br/>
						Uz: {formatTime(to.startDate)} - {formatTime(to.endDate)}
					</div>
				</div>)
				break;
			}
			case LOG_TYPE.LOG_SET_WORKING: logTypeTranslated = "atzīmēts kā ienācis"; break;
			case LOG_TYPE.LOG_SET_NOT_WORKING: logTypeTranslated = "atzīmēts kā izgājis"; break;
			case LOG_TYPE.LOG_EDIT_EMPLOYEE: logTypeTranslated = "regiģēts darbinieks"; break;
			case LOG_TYPE.LOG_ADD_EMPLOYEE: logTypeTranslated = "pievienots darbinieks"; break;
			default: {
				logTypeTranslated = "N/A";
				break;
			}
		}

		return (
			<Alert 
				className="pt-0 pb-0"
				key={notification.id} 
				variant={"info"}
			>
				<Row>
					<Col className="d-flex flex-column justify-content-center">
						{notificationData.user}
					</Col>
					<Col className="d-flex flex-column justify-content-center">
						{employee.surname + " " + employee.name}
					</Col>
					<Col className="d-flex flex-column justify-content-center">
						<span className="text-center">
							<b>{logTypeTranslated}</b>
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

	displayHistory = () => {
		const notifications = this.state.notifications.map((notification) => {
			const notificationData = JSON.parse(notification.data);

			switch(notification.type) {
				case LOG_TYPE.LOG_EDIT_WORK_LOG:
				case LOG_TYPE.LOG_ADD_EMPLOYEE:
				case LOG_TYPE.LOG_EDIT_EMPLOYEE:
				case LOG_TYPE.LOG_SET_NOT_WORKING:
				case LOG_TYPE.LOG_SET_WORKING: {
					const employee = this.props.employees.find((employee) => employee.id === notificationData.id);

					if(employee) {
						return this.history(notification, notificationData, employee);
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
		this.props.hideHistory();
	}

	render() {
		return (
			<Modal 
				size="lg"
				show={this.props.history.show}
				onHide={() => this.onHide()}
			>
				<Modal.Header closeButton>
					<Modal.Title className="w-100">Vēsture</Modal.Title>
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
							<Alert className="pt-0 pb-0">
								<Row>
									<Col>
										<b>Lietotājs</b>
									</Col>
									<Col>
										<b>Darbinieks</b>
									</Col>
									<Col className="d-flex flex-column justify-content-center text-center">
										<b>Darbība</b>
									</Col>
									<Col className="d-flex flex-column justify-content-center text-right">
										<b>Datums</b>
									</Col>
								</Row>
							</Alert>
							{this.displayHistory()}
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
		history: state.employees.history,
		user: state.employees.user,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		hideHistory: () => dispatch(hideHistory()),
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(History);

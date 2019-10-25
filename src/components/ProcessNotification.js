import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import { updateNotification } from "../utils/employeeUtils";

import { showProcessNotification, hideProcessNotification } from "../actions/employeeActions";

import { getSchedules, saveSchedules } from "../utils/employeeUtils";

class ProcessNotification extends React.PureComponent {
	constructor(props) {
		super(props);

		this.initialState = {
			comment: {
				text: "",
				expires: new Date(),
				manualDelete: false,
			}
		}

		this.state = {
			...this.initialState
		}
	}

	onExited = () => {
		this.setState({
			...this.initialState
		});
	}

	onCommentChange = (event) => {
		this.setState({ 
			text: event.target.value,
		});
	}

	updateNotification = () => {
		const notificationData = JSON.parse(this.props.notification.data);
		const notificationDate = new Date(this.props.notification.date);
		console.log(this.props.processNotification);
		const newData = {
			...notificationData,
			processed: true,
			comment: this.state.text,
			justified: this.props.processNotification.justified,
		}
		updateNotification(this.props.notification.id, this.props.notification.type, newData);
		this.props.hideProcessNotification();

		if(!this.props.processNotification.justified) {
			// Set schedule to DK
			getSchedules(notificationDate.getMonth()).then((res) => {
				let schedules = res.data;

				let parsedSchedules = schedules.map((schedule) => {
					return {
						...schedule,
						days: JSON.parse(schedule.days)
					}
				})

				let employeeScheduleIndex = schedules.findIndex((employee) => employee.employee_id === notificationData.id);

				if(employeeScheduleIndex !== -1) {
					Promise.all(parsedSchedules).then(() => {
						const dateIndex = notificationDate.getDate() - 1;
						parsedSchedules[employeeScheduleIndex].days[dateIndex] = "K";
						saveSchedules(parsedSchedules);
					})
				}
			})
		}
	}


	render() {
		if(this.props.notification !== null) {
			const notificationData = JSON.parse(this.props.notification.data);
			let header = notificationData.name + " " + notificationData.surname;
			switch(this.props.notification.type) {
				case "EMPLOYEE_LATE": {
					header += " (Darba kavējums)";
					break;
				}
			}

			return (
				<Modal
					show={this.props.processNotification.show}
					onExited={() => this.onExited()}
					onHide={() => this.props.hideProcessNotification()}
					centered
				>
					<Modal.Header closeButton>
						{header}
					</Modal.Header>

					<Modal.Body>
						<Form.Group as={Row}>
							<Form.Label column xs={3}>Komentārs: </Form.Label>
							<Col xs={9}>
								<Form.Control 
									as="textarea"
									rows="1"
									value={this.state.text}
									onChange={this.onCommentChange}
								/>
							</Col>
						</Form.Group>
					</Modal.Body>

					<Modal.Footer>
						<Button 
							variant={this.props.processNotification.justified ? "success" : "danger"}
							className="mr-1"
							size="sm"
							onClick={() => this.updateNotification()}
						>
							{this.props.processNotification.justified ? "Attaisnots" : "Neattaisnots"}
						</Button>
						<Button 
							variant="danger"
							className="mr-1"
							size="sm"
							onClick={() => this.props.hideProcessNotification()}
						>
							Atcelt
						</Button>
					</Modal.Footer>
				</Modal>
			);
		} else {
			return null;
		}
	}
}

function mapStateToProps(state) {
	return {
		processNotification: state.employees.processNotification,
		notification: state.employees.processNotification.notification,
		employee: state.employees.commentEmployee.employee,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showProcessNotification: () => dispatch(showProcessNotification()),
		hideProcessNotification: () => dispatch(hideProcessNotification()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProcessNotification);

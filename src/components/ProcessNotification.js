import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import { showProcessNotification, hideProcessNotification } from "../actions/employeeActions";

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
							<Form.Label column xs={3}>Attaisnojums: </Form.Label>
							<Col xs={9}>
								<Form.Control 
									as="textarea"
									rows="2"
									value={this.state.text}
									onChange={this.onCommentChange}
								/>
							</Col>
						</Form.Group>
					</Modal.Body>

					<Modal.Footer>
						<Button 
							variant="success"
							className="mr-1"
							size="sm"
							onClick={() => null}
						>
							Attaisnots
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

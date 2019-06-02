import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import BoostrapDatePicker from "./BoostrapDatePicker";
import "react-datepicker/dist/react-datepicker.css";

import { showCommentEmployee, hideCommentEmployee } from "../actions/employeeActions";

import { addEmployeeComment, getEmployees } from "../utils/employeeUtils";

class CommentEmployee extends React.Component {
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
		this.props.hideCommentEmployee();
		this.setState({
			...this.initialState
		});
	}

	onCommentChange = (event) => {
		this.setState({ 
			comment: {
				...this.state.comment,
				text: event.target.value
			}
		});
	}

	onExpiryDateChange = (date) => {
		console.log(date);
		this.setState({
			comment: {
				...this.state.comment,
				expires: date
			}
		});
	}

	onManualDeleteChange = () => {
		this.setState({ 
			comment: {
				...this.state.comment,
				manualDelete: !this.state.comment.manualDelete
			}
		});
	}

	render() {
		return (
			<Modal
				show={this.props.commentEmployee.show}
				onExited={() => this.onExited()}
				onHide={() => this.props.hideCommentEmployee()}
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.employee.name + " " + this.props.employee.surname}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form.Group as={Row}>
						<Form.Label column xs={2}>Komentārs</Form.Label>
						<Col xs={10}>
							<Form.Control 
								as="textarea"
								rows="3"
								value={this.state.comment.text}
								onChange={this.onCommentChange}
							/>
						</Col>
					</Form.Group>
					<Form.Group as={Row}>
						<Form.Label column xs={2}>Dzēst</Form.Label>
						<Col xs={10}>
							<DatePicker
								disabled={this.state.comment.manualDelete}
								dateFormat="yyyy.MM.dd HH:mm"
								customInput={<BoostrapDatePicker />}
								selected={this.state.comment.expires}
								onChange={this.onExpiryDateChange}
								maxDate={new Date()}
								showTimeSelect
								timeFormat="HH:mm"
							/>
						</Col>
					</Form.Group>
					<Form.Group>
						<Form.Check 
							type="checkbox" 
							label="Tikai manuāli dzēšams"
							name="manualDelete"
							checked={this.state.comment.manualDelete}
							onChange={this.onManualDeleteChange}/>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="success" onClick={() => {
						addEmployeeComment(this.props.employee, this.state.comment);
						this.props.hideCommentEmployee();
						getEmployees();
					}}>
						Pievienot
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		commentEmployee: state.employees.commentEmployee,
		employee: state.employees.commentEmployee.employee,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showCommentEmployee: () => dispatch(showCommentEmployee()),
		hideCommentEmployee: () => dispatch(hideCommentEmployee()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CommentEmployee);

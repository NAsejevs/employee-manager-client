import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";

import { showCommentEmployee, hideCommentEmployee } from "../actions/employeeActions";

import { addEmployeeComment, getEmployees } from "../utils/employeeUtils";

class CommentEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.initialState = {
			comment: {
				text: ""
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
				text: event.target.value
			}
		});
	}

	render() {
		return (
			<Modal 
				size="sm"
				show={this.props.commentEmployee.show}
				onExited={() => this.onExited()}
				onHide={() => this.props.hideCommentEmployee()}
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.employee.name + " " + this.props.employee.surname}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Komentārs</Form.Label>
							<Form.Control 
								as="textarea"
								rows="3"
								value={this.state.comment.text}
								onChange={this.onCommentChange}
							/>
						</Form.Group>
					</Form>
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

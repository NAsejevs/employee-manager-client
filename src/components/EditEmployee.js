import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";

import { showEditEmployee, hideEditEmployee } from "../actions/commandActions";

import { editServerEmployee, getEmployees } from "../utils/utils";

class EditEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			employee: {
				name: "",
				surname: "",
				personalCode: "",
			},
		}
	}

	onNameChange = (event) => {
		this.setState({ 
			employee: {
				...this.state.employee,
				name: event.target.value
			}
		});
	}

	onSurnameChange = (event) => {
		this.setState({ 
			employee: {
				...this.state.employee,
				surname: event.target.value
			}
		});
	}

	onPersonalCodeChange = (event) => {
		this.setState({ 
			employee: {
				...this.state.employee,
				personalCode: event.target.value
			}
		});
	}

	onEnter = () => {
		this.setState({ 
			employee: {
				...this.props.editEmployee.employee,
				name: this.props.editEmployee.employee.name,
				surname: this.props.editEmployee.employee.surname,
				personalCode: this.props.editEmployee.employee.personalCode,
			}
		});
	}

	render() {
		return (
			<Modal 
				centered
				show={this.props.editEmployee.show}
				onHide={() => this.props.hideEditEmployee()}
				onEnter={() => this.onEnter()}
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.editEmployee.employee.name + " " + this.props.editEmployee.employee.surname}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form.Group>
						<Form.Label>Vārds</Form.Label>
						<Form.Control required value={this.state.employee.name} onChange={this.onNameChange}/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Uzvārds</Form.Label>
						<Form.Control required value={this.state.employee.surname} onChange={this.onSurnameChange}/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Personas Kods</Form.Label>
						<Form.Control value={this.state.employee.personalCode} onChange={this.onPersonalCodeChange}/>
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={() => this.props.hideEditEmployee()}>Atcelt</Button>
					<Button variant="success" onClick={() => {
						editServerEmployee(this.state.employee).then(() => {
							getEmployees();
						});
						this.props.hideEditEmployee();
					}}>
						Rediģēt
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		editEmployee: state.employeeCommands.editEmployee,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showEditEmployee: () => dispatch(showEditEmployee()),
		hideEditEmployee: () => dispatch(hideEditEmployee()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditEmployee);

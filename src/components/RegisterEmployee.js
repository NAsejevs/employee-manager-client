import { connect } from "react-redux";
import React from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";

import { addServerEmployee, getServerEmployees, getServerEmployee, deleteServerEmployee } from "../utils/employeeUtils";

import { updateEmployees, showRegisterEmployee, hideRegisterEmployee } from "../actions/employeeActions";

const REGISTER_STATE = {
	DATA_INPUT: 0,
	RFID_WAIT: 1,
	COMPLETE: 2,
}

const DEBUG_MODE = false;

class RegisterEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			registrationState: REGISTER_STATE.DATA_INPUT,
			checkInterval: null,
			newEmployee: {},
			name: "",
			surname: "",
			personalCode: "",
			uid: "",
		}
	}


	onNameChange = (event) => {
		this.setState({ name: event.target.value });
	}

	onSurnameChange = (event) => {
		this.setState({ surname: event.target.value });
	}

	onPersonalCodeChange = (event) => {
		this.setState({ personalCode: event.target.value });
	}

	onFormSubmit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		
		const employee = {
			name: this.state.name,
			surname: this.state.surname,
			personalCode: this.state.personalCode,
		}

		// Darbiniek uvar reģistrēt nesavienojot to ar RFID kartiņu.
		// Kartiņu var pievienot pēc tam rediģējot darbinieku.
		
		if(this.state.registrationState === REGISTER_STATE.DATA_INPUT) {
			addServerEmployee(employee).then((res) => {

				const newEmployee = res.data;
				let checkInterval = null;

				if(newEmployee) {
					this.setState({
						newEmployee: newEmployee,
					});
					checkInterval = setInterval(() => {
						getServerEmployee(newEmployee.id).then((res) => {
							if(res.data.uid !== null || DEBUG_MODE) {
								clearInterval(checkInterval);
								this.setState({
									newEmployee: newEmployee,
									registrationState: REGISTER_STATE.COMPLETE,
								});
							}
						});
					}, 1000);
				}

				getServerEmployees().then((res) => {
					this.props.updateEmployees(res.data);
				});
			});

			this.setState({ 
				registrationState: REGISTER_STATE.RFID_WAIT,
			});
		} else if(this.state.registrationState === REGISTER_STATE.COMPLETE) {
			this.props.hideRegisterEmployee();
		}
	}

	hideRegisterEmployeeAndDelete = () => {
		if(this.state.registrationState >= REGISTER_STATE.RFID_WAIT) {
			deleteServerEmployee(this.state.newEmployee.id);
			this.props.hideRegisterEmployee();
		}
	}

	onExited = () => {
		this.setState({
			registrationState: REGISTER_STATE.DATA_INPUT,
			checkInterval: null,
			newEmployee: {},
			name: "",
			surname: "",
			personalCode: "",
			uid: ""
		});
	}

	render() {
		return (
			<Modal 
				centered
				show={this.props.registerEmployee.show} 
				onHide={() => this.props.hideRegisterEmployee()}
				onExit={this.deleteAndCancel}
				onExited={this.onExited}
			>
				<Form onSubmit={this.onFormSubmit}>
				<Modal.Header closeButton>
					<Modal.Title>Pievienot Darbinieku</Modal.Title>
				</Modal.Header>
				<Modal.Body>

					<Form.Group>
						<Form.Label>* Vārds</Form.Label>
						<Form.Control 
							required 
							disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT} 
							value={this.state.name} 
							onChange={this.onNameChange}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>* Uzvārds</Form.Label>
						<Form.Control 
							required 
							disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT} 
							value={this.state.surname} 
							onChange={this.onSurnameChange}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Personas Kods</Form.Label>
						<Form.Control 
							disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT} 
							value={this.state.personalCode} 
							onChange={this.onPersonalCodeChange}
						/>
					</Form.Group>

					<Alert variant={"primary"} show={this.state.registrationState === REGISTER_STATE.RFID_WAIT} onClose={() => null}>
						Noskenējiet vēlamo RFID kartiņu.
					</Alert>

					<Alert variant={"success"} show={this.state.registrationState === REGISTER_STATE.COMPLETE} onClose={() => null}>
						Darbinieks veiksmīgi pievienots darbinieku sarakstam.
					</Alert>

				</Modal.Body>
				<Modal.Footer>
					<Buttons 
						registrationState={this.state.registrationState}
						hideRegisterEmployee={this.props.hideRegisterEmployee}
						hideRegisterEmployeeAndDelete={this.hideRegisterEmployeeAndDelete}
					/>
				</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}

function Buttons(props) {
	switch(props.registrationState) {
		case REGISTER_STATE.DATA_INPUT: {
			return(
				<>
					<Button variant="secondary" onClick={() => props.hideRegisterEmployee()}>Atcelt</Button>
					<Button type="submit">
						Tālāk
					</Button>
				</>
			);
		}
		case REGISTER_STATE.RFID_WAIT: {
			return(
				<Button variant="secondary" onClick={() => props.hideRegisterEmployeeAndDelete()}>Atcelt</Button>
			);
		}
		case REGISTER_STATE.COMPLETE: {
			return(
				<>
					<Button variant="success" type="submit">
						Pabeigt
					</Button>
				</>
			);
		}
		default: {
			return(
				<>
					<Button variant="secondary" onClick={() => props.hideRegisterEmployee()}>Atcelt</Button>
					<Button type="submit">
						Tālāk
					</Button>
				</>
			);
		}
	}
}

function mapStateToProps(state) {
	return {
		employees: state.employees.employees,
		registerEmployee: state.employees.registerEmployee
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateEmployees: (employees) => dispatch(updateEmployees(employees)),
		showRegisterEmployee: () => dispatch(showRegisterEmployee()),
		hideRegisterEmployee: () => dispatch(hideRegisterEmployee()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterEmployee);

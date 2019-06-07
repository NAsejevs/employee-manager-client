import { connect } from "react-redux";
import React from "react";
import { Form, Button, Alert, Modal, Row, Col } from "react-bootstrap";

import { showRegisterEmployee, hideRegisterEmployee } from "../actions/employeeActions";

import { storeUpdateEmployees, addServerEmployee, getServerEmployee, deleteServerEmployee } from "../utils/employeeUtils";

const REGISTER_STATE = {
	DATA_INPUT: 0,
	RFID_WAIT: 1,
	COMPLETE: 2,
}

class RegisterEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.initialState = {
			registrationState: REGISTER_STATE.DATA_INPUT,
			checkInterval: null,
			newEmployee: {},
			name: "",
			surname: "",
			company: 'SIA "Vārpas 1"',
			position: "",
			number: "",
			personalCode: "",
			addCard: true,
			uid: ""
		}

		this.state = {
			...this.initialState
		}
	}


	onNameChange = (event) => {
		this.setState({ name: event.target.value });
	}

	onSurnameChange = (event) => {
		this.setState({ surname: event.target.value });
	}

	onCompanyChange = (event) => {
		this.setState({ company: event.target.value });
	}

	onPositionChange = (event) => {
		this.setState({ position: event.target.value });
	}

	onNumberChange = (event) => {
		this.setState({ number: event.target.value });
	}

	onPersonalCodeChange = (event) => {
		this.setState({ personalCode: event.target.value });
	}

	onAddCardChange = () => {
		this.setState({ addCard: !this.state.addCard });
	}

	onFormSubmit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		
		const employee = {
			name: this.state.name,
			surname: this.state.surname,
			company: this.state.company,
			position: this.state.position,
			number: this.state.number,
			personalCode: this.state.personalCode,
		}
		
		if(this.state.registrationState === REGISTER_STATE.DATA_INPUT) {
			if(this.state.addCard) {
				addServerEmployee(employee).then((res) => {
					storeUpdateEmployees();
					const newEmployee = res.data;
					let checkInterval = null;

					//addCard(newEmployee.id);
	
					if(newEmployee) {
						this.setState({
							newEmployee: newEmployee,
						});
						checkInterval = setInterval(() => {
							getServerEmployee(newEmployee.id).then((res) => {
								if(res.data.uid !== null) {
									clearInterval(checkInterval);
									this.setState({
										newEmployee: newEmployee,
										registrationState: REGISTER_STATE.COMPLETE,
									});
								}
							});
						}, 1000);
					}

					this.setState({ 
						registrationState: REGISTER_STATE.RFID_WAIT,
					});
				});
			} else {
				addServerEmployee(employee).then((res) => {
					storeUpdateEmployees();
					if(res.data) {
						this.setState({ 
							registrationState: REGISTER_STATE.COMPLETE,
						});
					}
				});
			}
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
			...this.initialState
		});
	}

	render() {
		return (
			<Modal 
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

					<Row>
						<Col>
							<Form.Group>
								<Form.Label>* Vārds</Form.Label>
								<Form.Control 
									required 
									disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT} 
									value={this.state.name} 
									onChange={this.onNameChange}
									placeholder="Vārds"
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>* Uzvārds</Form.Label>
								<Form.Control 
									required 
									disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT} 
									value={this.state.surname} 
									onChange={this.onSurnameChange}
									placeholder="Uzvārds"
								/>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col>
							<Form.Group>
								<Form.Label>Personas Kods</Form.Label>
								<Form.Control 
									disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT} 
									value={this.state.personalCode} 
									onChange={this.onPersonalCodeChange}
									placeholder="Personas Kods"
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Telefona Numurs</Form.Label>
								<Form.Control 
									disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT} 
									value={this.state.number} 
									onChange={this.onNumberChange}
									placeholder="Telefona Numurs"
								/>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group>
						<Form.Label>Uzņēmums</Form.Label>
						<Form.Control 
							as="select"
							disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT}  
							onChange={this.onCompanyChange}
						>
							<option>SIA "Vārpas 1"</option>
							<option>SIA "Adeptus Renewable Energy"</option>
							<option>SIA "Valkas koks"</option>
						</Form.Control>
					</Form.Group>

					<Form.Group>
						<Form.Label>Amats</Form.Label>
						<Form.Control 
							disabled={this.state.registrationState !== REGISTER_STATE.DATA_INPUT} 
							value={this.state.position} 
							onChange={this.onPositionChange}
							placeholder="Darba Amats"
						/>
					</Form.Group>

					<Form.Group controlId="formBasicChecbox">
						<Form.Check 
							type="checkbox" 
							label="Turpināt reģistrāciju pievienojot NFC karti"
							name="addCard"
							checked={this.state.addCard}
							onChange={this.onAddCardChange}/>
					</Form.Group>

					<Alert variant={"primary"} show={this.state.registrationState === REGISTER_STATE.RFID_WAIT} onClose={() => null}>
						Noskenējiet vēlamo kartiņu.
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
						addCard={this.state.addCard}
					/>
				</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}

function Buttons(props) {
	switch(props.registrationState) {
		default:
		case REGISTER_STATE.DATA_INPUT: {
			return(
				<>
					<Button variant={ props.addCard ? "primary" : "success"} type="submit">
						{
							props.addCard 
							? "Tālāk"
							: "Pabeigt"
						}
					</Button>
				</>
			);
		}
		case REGISTER_STATE.RFID_WAIT: {
			return(
				null
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
		showRegisterEmployee: () => dispatch(showRegisterEmployee()),
		hideRegisterEmployee: () => dispatch(hideRegisterEmployee()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterEmployee);

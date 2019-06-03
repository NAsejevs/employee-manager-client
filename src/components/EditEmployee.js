import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

import { showEditEmployee, hideEditEmployee } from "../actions/employeeActions";

import { editServerEmployee, changeCard, deleteCard, getServerEmployee } from "../utils/employeeUtils";

const CHANGE_CARD_STATE = {
	OFF: 0,
	RFID_WAIT: 1,
	COMPLETE: 2,
}

class EditEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.initialState = {
			employee: {
				name: "",
				surname: "",
				personalCode: "",
				position: "",
				number: "",
				uid: "",
				changeCard: {
					status: 0,
				}
			}
		}

		this.state = {
			...this.initialState
		}
	}

	onEnter = () => {
		this.setState({ 
			employee: {
				...this.state.employee,
				id: this.props.editEmployee.employee.id,
				name: this.props.editEmployee.employee.name,
				surname: this.props.editEmployee.employee.surname,
				personalCode: this.props.editEmployee.employee.personalCode,
				position: this.props.editEmployee.employee.position,
				number: this.props.editEmployee.employee.number,
				uid: this.props.editEmployee.employee.uid,
				changeCard: {
					status: 0,
				}
			}
		});
	}

	onHide = () => {
		this.props.hideEditEmployee();
		this.setState({
			...this.initialState
		})
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

	onPositionChange = (event) => {
		this.setState({ 
			employee: {
				...this.state.employee,
				position: event.target.value
			}
		});
	}

	onNumberChange = (event) => {
		this.setState({ 
			employee: {
				...this.state.employee,
				number: event.target.value
			}
		});
	}

	changeCard = (id) => {
		this.setState({
			employee: {
				...this.state.employee,
				changeCard: {
					...this.state.employee.changeCard,
					status: CHANGE_CARD_STATE.RFID_WAIT
				}
			}
		});
		changeCard(id).then((res) => {
			if(this.props.editEmployee.show) {
				this.setState({
					employee: {
						...this.state.employee,
						changeCard: {
							...this.state.employee.changeCard,
							status: CHANGE_CARD_STATE.COMPLETE
						}
					}
				});
				this.updateUID(id);
			}
		}).catch(() => {
			if(this.props.editEmployee.show) {
				this.checkCard(id);
			}
		});
	}

	deleteCard = (id) => {
		deleteCard(id).then(() => {
			this.updateUID(id);
		});
	}

	updateUID = (id) => {
		getServerEmployee(id).then((res) => {
			this.setState({ 
				employee: {
					...this.state.employee,
					uid: res.data.uid,
				}
			});
		});
	}

	render() {
		return (
			<Modal 
				show={this.props.editEmployee.show}
				onHide={() => this.onHide()}
				onEnter={() => this.onEnter()}
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.editEmployee.employee.name + " " + this.props.editEmployee.employee.surname}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Row>
						<Col>
							<Form.Group>
								<Form.Label>* Vārds</Form.Label>
								<Form.Control required value={this.state.employee.name} onChange={this.onNameChange}/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>* Uzvārds</Form.Label>
								<Form.Control required value={this.state.employee.surname} onChange={this.onSurnameChange}/>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group>
						<Form.Label>Personas Kods</Form.Label>
						<Form.Control value={this.state.employee.personalCode} onChange={this.onPersonalCodeChange}/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Amats</Form.Label>
						<Form.Control value={this.state.employee.position} onChange={this.onPositionChange}/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Telefona Numurs</Form.Label>
						<Form.Control value={this.state.employee.number} onChange={this.onNumberChange}/>
					</Form.Group>

					<Form.Group as={Row}>
						<Form.Label column xs={"auto"}>UID (NFC Karte)</Form.Label>
						<Col>
							<Form.Control disabled value={this.state.employee.uid ? this.state.employee.uid : "NAV"}/>
						</Col>
						<Col xs={"auto"}>
							<Button variant="link" onClick={() => this.deleteCard(this.props.editEmployee.employee.id)}>Dzēst</Button>
						</Col>
						<Col xs={"auto"}>
							<Button variant="link" onClick={() => this.changeCard(this.props.editEmployee.employee.id)}>Mainīt</Button>
						</Col>
					</Form.Group>

					<Alert 
						variant={"primary"} 
						show={
							this.state.employee.changeCard.status === CHANGE_CARD_STATE.RFID_WAIT
						} 
						onClose={() => null}
					>
						Noskenējiet vēlamo kartiņu.
					</Alert>

					<Alert 
						variant={"success"} 
						show={
							this.state.employee.changeCard.status === CHANGE_CARD_STATE.COMPLETE
						} 
						onClose={() => null}
					>
						Darbiniekam veiksmīgi nomainīta karte.
					</Alert>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="success" onClick={() => {
						editServerEmployee(this.state.employee);
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
		editEmployee: state.employees.editEmployee,
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

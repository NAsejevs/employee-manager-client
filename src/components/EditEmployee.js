import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

import { showEditEmployee, hideEditEmployee } from "../actions/employeeActions";

import {
	setEmployeeUID,
	removeEmployeeUID,
	awaitCard,
	storeUpdateEmployee,
	editServerEmployee,
} from "../utils/employeeUtils";

import {
	addZero
} from "../utils/commonUtils";

const CHANGE_CARD_STATE = {
	OFF: 0,
	RFID_WAIT: 1,
	COMPLETE: 2,
	DELETED: 3,
}

class EditEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.initialState = {
			employee: {
				name: "",
				surname: "",
				personalCode: "",
				company: "",
				position: "",
				number: "",
				uid: ""
			},
			changeCard: {
				status: 0,
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
				...this.props.editEmployee.employee,
			}
		}, () => {
			if(!this.state.employee.company) {
				this.setState({
					employee: {
						...this.state.employee,
						company: 'SIA "Vārpas 1"',
					}
				});
			}
		});
	}

	onHide = () => {
		this.props.hideEditEmployee();
		this.setState({
			...this.initialState
		});
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

	onCompanyChange = (event) => {
		console.log(event.target.value);
		this.setState({ 
			employee: {
				...this.state.employee,
				company: event.target.value
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
			changeCard: {
				status: CHANGE_CARD_STATE.RFID_WAIT
			}
		});

		awaitCard().then((res) => {
			if(res.data) {
				setEmployeeUID(res.data.uid, id).then(() => {
					storeUpdateEmployee(id);
	
					this.setState({
						employee: {
							...this.state.employee,
							uid: res.data.uid,
							uid_added: new Date(),
						},
						changeCard: {
							status: CHANGE_CARD_STATE.COMPLETE
						}
					});
	
				});
			} else {
				this.setState({
					changeCard: {
						status: CHANGE_CARD_STATE.OFF
					}
				});
			}
		});
	}

	deleteCard = (id) => {
		removeEmployeeUID(id).then(() => {
			storeUpdateEmployee(id);

			this.setState({
				employee: {
					...this.state.employee,
					uid: "N/A",
					uid_added: null,
				},
				changeCard: {
					status: CHANGE_CARD_STATE.DELETED
				}
			});
		});
	}

	render() {
		const uidAddedDate = new Date(this.state.employee.uid_added);
		const uidAdded = 
			addZero(uidAddedDate.getDate()) + "." 
			+ addZero(uidAddedDate.getMonth() + 1) + "." 
			+ addZero(uidAddedDate.getFullYear());

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

					<Row>
						<Col>
							<Form.Group>
								<Form.Label>Personas Kods</Form.Label>
								<Form.Control value={this.state.employee.personalCode} onChange={this.onPersonalCodeChange}/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Telefona Numurs</Form.Label>
								<Form.Control value={this.state.employee.number} onChange={this.onNumberChange}/>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group>
						<Form.Label>Uzņēmums</Form.Label>
						<Form.Control 
							as="select"
							onChange={this.onCompanyChange}
							value={
								this.state.employee.company
								? this.state.employee.company
								: 'SIA "Vārpas 1"'
							}
						>
							<option value='SIA "Vārpas 1"'>SIA "Vārpas 1"</option>
							<option value='SIA "Adeptus Renewable Energy"'>SIA "Adeptus Renewable Energy"</option>
							<option value='SIA "Valkas koks"'>SIA "Valkas koks"</option>
						</Form.Control>
					</Form.Group>

					<Form.Group>
						<Form.Label>Amats</Form.Label>
						<Form.Control value={this.state.employee.position} onChange={this.onPositionChange}/>
					</Form.Group>

					<Form.Group as={Row}>
						<Form.Label column xs={"auto"}>UID (NFC Karte)</Form.Label>
						<Col>
							<Form.Control
								disabled 
								value={this.state.employee.uid ? this.state.employee.uid : "N/A"}
								className="text-center"
							/>
						</Col>
						<Col xs={"auto"}>
							<Button variant="link" onClick={() => this.deleteCard(this.props.editEmployee.employee.id)}>Dzēst</Button>
						</Col>
						<Col xs={"auto"}>
							<Button variant="link" onClick={() => this.changeCard(this.props.editEmployee.employee.id)}>Mainīt</Button>
						</Col>
					</Form.Group>

					{
						this.state.employee.uid_added
						? <Form.Group as={Row}>
							<Form.Label column>Karte reģistrēta: { uidAdded }</Form.Label>
						</Form.Group>
						: null
					}

					<Alert 
						variant={"primary"} 
						show={
							this.state.changeCard.status === CHANGE_CARD_STATE.RFID_WAIT
						} 
						onClose={() => null}
					>
						Noskenējiet vēlamo kartiņu.
					</Alert>

					<Alert 
						variant={"success"} 
						show={
							this.state.changeCard.status === CHANGE_CARD_STATE.COMPLETE
						} 
						onClose={() => null}
					>
						Darbiniekam karte nomainīta.
					</Alert>

					<Alert 
						variant={"danger"} 
						show={
							this.state.changeCard.status === CHANGE_CARD_STATE.DELETED
						} 
						onClose={() => null}
					>
						Darbinieka karte dzēsta.
					</Alert>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="success" onClick={() => {
						const employeeId = this.state.employee.id;
						editServerEmployee(this.state.employee).then(() => {
							storeUpdateEmployee(employeeId);
						});
						this.props.hideEditEmployee();
						this.onHide();
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

import { connect } from 'react-redux';
import React from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';

import { addServerEmployee, getServerEmployees } from '../utils/utils';

import { updateDisplayEmployees } from '../actions/employeeActions';

class Registration extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			surname: "",
			personalCode: "",
			success: false,
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

		addServerEmployee(employee).then(() => {
			getServerEmployees().then((res) => {
				this.props.updateDisplayEmployees(res.data);
				this.setState({
					success: true,
				});
				setTimeout(() => {
					this.setState({
						success: false,
					});
				}, 3000);
			});
		}).catch(() => {
			console.log(" wefwef");
		});

		this.setState({ 
			name: "", 
			surname: "" , 
			personalCode: "",
		});
	}

	render() {
		return (
			<Modal.Dialog className="modalContainer">
				<Form onSubmit={this.onFormSubmit}>
					<Modal.Header>
						<Modal.Title>Jauna Darbinieka Reģistrācija</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Form.Group>
							<Form.Label>* Vārds</Form.Label>
							<Form.Control required value={this.state.name} onChange={this.onNameChange}/>
						</Form.Group>

						<Form.Group>
							<Form.Label>* Uzvārds</Form.Label>
							<Form.Control required value={this.state.surname} onChange={this.onSurnameChange}/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Personas Kods</Form.Label>
							<Form.Control value={this.state.personalCode} onChange={this.onPersonalCodeChange}/>
						</Form.Group>
						<Alert variant={"success"} show={this.state.success}>
							Darbinieks veiksmīgi pievienots darbinieku sarakstam!
						</Alert>
					</Modal.Body>

					<Modal.Footer>
						<Button type="submit">
							Pievienot!
						</Button>
					</Modal.Footer>
				</Form>
			</Modal.Dialog>
		);
	}
}

function mapStateToProps(state) {
	return {
		employees: state.employees.employees,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateDisplayEmployees: (employees) => dispatch(updateDisplayEmployees(employees)),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Registration);

import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";

import { showDeleteEmployee, hideDeleteEmployee } from "../actions/commandActions";

import { deleteEmployee } from "../utils/utils";

class DeleteEmployee extends React.Component {
	render() {
		return (
			<Modal 
				centered
				show={this.props.deleteEmployee.show}
				onHide={() => this.props.hideDeleteEmployee()}
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.deleteEmployee.employee.name + " " + this.props.deleteEmployee.employee.surname}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					Vai esiet pārliecināts ka vēlaties dzēst šo darbinieku?
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={() => this.props.hideDeleteEmployee()}>Atcelt</Button>
					<Button variant="danger" onClick={() => {
						deleteEmployee(this.props.deleteEmployee.employee.id);
						this.props.hideDeleteEmployee();
					}}>
						Dzēst
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		deleteEmployee: state.employeeCommands.deleteEmployee,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showDeleteEmployee: () => dispatch(showDeleteEmployee()),
		hideDeleteEmployee: () => dispatch(hideDeleteEmployee()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DeleteEmployee);

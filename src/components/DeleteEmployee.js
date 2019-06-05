import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";

import { showDeleteEmployee, hideDeleteEmployee } from "../actions/employeeActions";

import { storeUpdateEmployees, deleteServerEmployee } from "../utils/employeeUtils";

class DeleteEmployee extends React.Component {
	render() {
		return (
			<Modal 
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
					<Button variant="danger" onClick={() => {
						deleteServerEmployee(this.props.deleteEmployee.employee.id).then(() => {
							storeUpdateEmployees();
						});
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
		deleteEmployee: state.employees.deleteEmployee,
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

import React from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";

import { showDeleteEmployee, hideDeleteEmployee } from "../actions/commandActions";

class DeleteEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
		}
	}

	onModalHide = () => {
		this.setState({
			show: false,
		});
	}

	render() {
		return (
			<Modal 
				show={this.props.deleteEmployee.show} 
				onHide={() => this.props.hideDeleteEmployee()} 
				size={"lg"}
			>
				<Modal.Header closeButton>
					<Modal.Title>Dzēst Darbinieku?</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					Vai esiet pārliecināts ka vēlaties dzēst šo darbinieku?
				</Modal.Body>
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

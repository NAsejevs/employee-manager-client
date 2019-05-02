import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Alert } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

import { showCheckCard, hideCheckCard, showEmployeeWorkLog } from "../actions/employeeActions";

import { checkCard } from "../utils/employeeUtils";

class CheckCard extends React.Component {
	constructor() {
		super();

		this.state = {
			cardScanned: false,
			employee: {}
		}
	}

	checkCard = (status) => {
		if(status) {
			checkCard(status).then((res) => {
				if(this.props.checkCard.show) {
					this.hideModal();
					this.props.showEmployeeWorkLog(res.data.id);
				}
			}).catch(() => {
				if(this.props.checkCard.show) {
					this.checkCard(status);
				}
			});
		} else {
			checkCard(status);
		}
	}

	hideModal = () => {
		this.props.hideCheckCard();
		this.checkCard(false);

		this.setState({
			cardScanned: false,
			employee: {}
		});
	}

	render() {
		return (
			<Modal 
				centered
				show={this.props.checkCard.show}
				onHide={this.hideModal}
				onEntered={() => this.checkCard(true)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Pārbaudīt kartes īpašnieku</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Alert variant={"primary"} show={!this.state.cardScanned}>
						Noskenējiet vēlamo RFID kartiņu.
					</Alert>
					{
						this.state.cardScanned && this.state.employee !== false
						? <div>
							Vārds: {this.state.employee.name + " " + this.state.employee.surname}
						</div>
						: null
					}
					{
						this.state.cardScanned && this.state.employee === false
						? <div>
							Uz šīs kartiņas nav reģistrēts neviens darbinieks.
						</div>
						: null
					}
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={this.hideModal}>Atcelt</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		checkCard: state.employees.checkCard,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showCheckCard: () => dispatch(showCheckCard()),
		hideCheckCard: () => dispatch(hideCheckCard()),
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id)),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CheckCard);

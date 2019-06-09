import React from "react";
import { connect } from "react-redux";
import { Modal, Alert } from "react-bootstrap";

import { showCheckCard, hideCheckCard, showEmployeeWorkLog } from "../actions/employeeActions";

import { awaitCard, getEmployeeByUID } from "../utils/employeeUtils";

//import { checkCard } from "../utils/employeeUtils";

class CheckCard extends React.Component {
	constructor() {
		super();

		this.state = {
			cardScanned: false,
			notFound: false,
		}
	}

	checkCard = () => {
		awaitCard().then((res) => {
			if(res.data) {	
				getEmployeeByUID(res.data.uid).then((res2) => {
					if(res2.data) {
						this.hideModal();
						this.props.showEmployeeWorkLog(res2.data.id);
					} else {
						this.setState({
							cardScanned: true,
							notFound: true,
						});
					}
				});
			}
		});
	}

	hideModal = () => {
		this.props.hideCheckCard();

		this.setState({
			cardScanned: false,
			employee: {}
		});
	}

	render() {
		return (
			<Modal 
				show={this.props.checkCard.show}
				onHide={this.hideModal}
				onEntered={() => this.checkCard()}
			>
				<Modal.Header closeButton>
					<Modal.Title>Atrast darbinieku pēc kartes</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Alert variant={"primary"} show={!this.state.cardScanned}>
						Noskenējiet NFC kartiņu...
					</Alert>
					<Alert variant={"danger"} show={this.state.cardScanned && this.state.notFound}>
						Uz šīs kartiņas nav reģistrēts neviens darbinieks.
					</Alert>
				</Modal.Body>
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

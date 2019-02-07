import { connect } from 'react-redux';
import React from 'react';
import { Row, Col, Modal } from 'react-bootstrap';

import { getServerEmployee } from '../utils/utils';

import '../styles/main.css';

class ViewEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: this.props.match.params.id,
			employee: new Object(),
		}
	}

	componentDidMount() {
		getServerEmployee(this.state.userId).then((res) => {
			this.setState({
				employee: res.data
			})

			console.log(res.data);
		})
	}

	render() {
		return (
			<Modal.Dialog className="modalContainer">
				<Modal.Header>
					<Modal.Title>{this.state.employee.name + " " + this.state.employee.surname}</Modal.Title>
				</Modal.Header>
			</Modal.Dialog>
		);
	}
}

function mapStateToProps(state) {
	return {
	};
}

function mapDispatchToProps(dispatch) {
	return {
		
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewEmployee);

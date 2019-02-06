import { connect } from 'react-redux';
import React from 'react';

import Employees from './Employees';
import Registration from './Registration';
import logo from '../images/logo.png';

import { Container, Row, Col, Navbar } from 'react-bootstrap';

class App extends React.Component {
	render() {
		const months = [
			"Janvāris",
			"Februāris",
			"Marts",
			"Aprīlis",
			"Maijs",
			"Jūnijs",
			"Jūlijs",
			"Augusts",
			"Septembris",
			"Oktobris",
			"Novembris",
			"Decembris"
		];

		const date = new Date();
		

		const displayDate = date.getDate().toString() + ". " 
			+ months[date.getMonth()]
			+ " "
			+ date.getFullYear()
			+ ". gads";

		return (
			<Container>
				<Navbar bg="dark" variant="dark">
					<Navbar.Brand>
						<img 
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>
						{' VĀRPAS 1'}
					</Navbar.Brand>
					<Navbar.Collapse className="justify-content-end">
						<Navbar.Text>
							{displayDate}
						</Navbar.Text>
					</Navbar.Collapse>
				</Navbar>
				<Row>
					<Col xs={8}>
						<Employees/>
					</Col>
					<Col>
						<Registration/>
					</Col>
				</Row>
			</Container>
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
)(App);

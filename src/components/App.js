import { connect } from 'react-redux';
import React from 'react';

import Employees from './Employees';
import Registration from './Registration';

import { Container, Row, Col, Navbar } from 'react-bootstrap';

class App extends React.Component {
	render() {
		return (
			<Container>
				<Navbar bg="dark" variant="dark">
					<Navbar.Brand href="#home">
						{'VĀRPAS 1'}
					</Navbar.Brand>
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

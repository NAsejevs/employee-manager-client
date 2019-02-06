import { connect } from 'react-redux';
import React from 'react';

import Employees from './Employees';
import Registration from './Registration';
import DateTime from "./DateTime";

import logo from '../images/logo.png';

import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';

class App extends React.Component {
	
	constructor() {
		super();

		this.visibility = {
			VISIBILITY_EMPLOYEES: 1, 
			VISIBILITY_REGISTRATION: 2
		};
		Object.freeze(this.visibility);

		this.state = {
			visibilityState: this.visibility.VISIBILITY_EMPLOYEES
		}
	}

	render() {
		let renderComponent = null;

		switch(this.state.visibilityState) {
			case this.visibility.VISIBILITY_EMPLOYEES: {
				renderComponent = <Employees/>;
				break;
			}
			case this.visibility.VISIBILITY_REGISTRATION: {
				renderComponent = <Registration/>;
				break;
			}
			default: {
				renderComponent = <Employees/>;
			}
		}

		return (
			<Container>
				<Row>
					<Col>
						<Navbar bg="dark" variant="dark">
							<Navbar.Brand>
								<img 
									src={logo}
									alt=""
									width="30"
									height="30"
									className="d-inline-block align-top"
								/>
								{' VĀRPAS 1'}
							</Navbar.Brand>
							<Navbar.Collapse className="justify-content-start">
								<Nav className="mr-auto">
									<Nav.Link onClick={this.onClickEmployees}>Darbinieki</Nav.Link>
									<Nav.Link onClick={this.onClickRegistration}>Reģistrācija</Nav.Link>
								</Nav>
							</Navbar.Collapse>
							<Navbar.Collapse className="justify-content-end">
								<Navbar.Text>
									<DateTime/>
								</Navbar.Text>
							</Navbar.Collapse>
						</Navbar>
					</Col>
				</Row>
				<Row>
					<Col>
						{renderComponent}
					</Col>
				</Row>
			</Container>
		);
	}

	onClickEmployees = () => {
		this.setState({
			visibilityState: this.visibility.VISIBILITY_EMPLOYEES
		});
	}

	onClickRegistration = () => {
		this.setState({
			visibilityState: this.visibility.VISIBILITY_REGISTRATION
		});
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

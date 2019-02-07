import { connect } from 'react-redux';
import React from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

import Employees from './Employees';
import ViewEmployee from "./ViewEmployee";
import Registration from './Registration';
import DateTime from "./DateTime";
import NotFound from "./NotFound";

import logo from '../images/logo.png';

import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';

import '../styles/main.css';

class App extends React.Component {
	render() {
		return (
			<Router>
				<Container className="container">
					<Row>
						<Col>
							<Navbar bg="dark" variant="dark" fixed="top">
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
										<Nav.Link>
											<Link to="/">Darbinieki</Link>
										</Nav.Link>
										<Nav.Link>
											<Link to="/registration">Reģistrācija</Link>
										</Nav.Link>
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
							<Switch>
								<Route exact path="/" component={Employees} />
								<Route path="/registration" component={Registration} />
								<Route path="/employee/:id" component={ViewEmployee} />
								<Route component={NotFound} />
							</Switch>
						</Col>
					</Row>
				</Container>
			</Router>
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

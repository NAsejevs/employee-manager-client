import { connect } from "react-redux";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import Employees from "./Employees";
import Registration from "./Registration";
import DateTime from "./DateTime";
import NotFound from "./NotFound";
import DeleteEmployee from "./DeleteEmployee";

import logo from "../images/logo.png";

import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";

import "../styles/main.css";

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			showRegistrationModal: false,
		}
	}

	showRegistration = () => {
		this.setState({
			showRegistrationModal: true,
		});
	}

	handleRegistrationClose = () => {
		this.setState({
			showRegistrationModal: false,
		});
	}

	render() {
		return (
			<Router>
				<Container className="container">
					<Row>
						<Col>
							<Navbar bg="dark" variant="dark" fixed="top" expand="md">
								<Navbar.Brand>
									<img 
										src={logo}
										alt=""
										width="30"
										height="30"
										className="d-inline-block align-top"
									/>
									{" VĀRPAS 1"}
								</Navbar.Brand>
								<Navbar.Toggle aria-controls="responsive-navbar-nav"/>
								<Navbar.Collapse id="responsive-navbar-nav">
									<Nav className="mr-auto">
										<LinkContainer exact={true} to="/">
											<Nav.Link>Darbinieki</Nav.Link>
										</LinkContainer>
										<Nav.Link onClick={this.showRegistration}>Reģistrācija</Nav.Link>
									</Nav>
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
								<Route component={NotFound} />
							</Switch>
							<Registration 
								showRegistrationModal={this.state.showRegistrationModal}
								handleRegistrationClose={this.handleRegistrationClose}
							/>
							<DeleteEmployee/>
						</Col>
					</Row>
					<Row>
						<Col className="footer">
							Vārpas 1 © 2019
						</Col>
					</Row>
				</Container>
			</Router>
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

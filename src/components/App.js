import { connect } from "react-redux";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import Employees from "./Employees";
import RegisterEmployee from "./RegisterEmployee";
//import DateTime from "./DateTime";
import NotFound from "./NotFound";
import DeleteEmployee from "./DeleteEmployee";
import EditEmployee from "./EditEmployee";
import ExportExcel from "./ExportExcel";
import LogIn from "./LogIn";

import { checkSession, logOut, getUserByKey } from "../utils/userUtils";

import "../styles/main.css";

import logo from "../images/logo.png";
import { FiLogOut } from "react-icons/fi";

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			authenticated: false,
			user: {
				username: ""
			}
		}
	}

	componentDidMount() {
		// Check user session before displaying anything
		checkSession().then((res) => {
			this.setState({
				loading: false,
				authenticated: res.data,
			});
		}).then(() => {
			getUserByKey().then((res) => {
				this.setState({
					user: res.data,
				});
			})
		});
	}

	logOut = () => {
		logOut();
		window.location.reload();
	}

	render() {
		if(this.state.loading) {
			// Loading screen
			return (
				<div className="text-center">
					<Spinner animation="border"/>
				</div>
			);
		} else {
			if(this.state.authenticated) {
				// User interface
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
												{/* <Nav.Link onClick={this.props.showRegisterEmployee}>Reģistrācija</Nav.Link> */}
											</Nav>
											<Nav>
												{/* <Navbar.Text>
													<DateTime/>
												</Navbar.Text> */}
												<Navbar.Text className="ml-md-4">
													<u>{this.state.user.username}</u>
												</Navbar.Text>
												<Nav.Link className="ml-md-2" onClick={this.logOut}>
													Iziet
													<FiLogOut className="ml-1"/>
												</Nav.Link>
											</Nav>
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
									<RegisterEmployee/>
									<DeleteEmployee/>
									<EditEmployee/>
									<ExportExcel/>
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
			} else {
				// User Log In
				return (
					<LogIn/>
				);
			}
		}
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

import { connect } from "react-redux";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Row, Col, Navbar, Nav, Spinner } from "react-bootstrap";

import { production, employeeUpdateInterval } from "../utils/config";

import Employees from "./Employees";
import Report from "./Report";
import RegisterEmployee from "./RegisterEmployee";
import NotFound from "./NotFound";
import ViewEmployee from "./ViewEmployee";
import DeleteEmployee from "./DeleteEmployee";
import EditEmployee from "./EditEmployee";
import ExportExcel from "./ExportExcel";
import LogIn from "./LogIn";
import CheckCard from "./CheckCard";
import CommentEmployee from "./CommentEmployee";
import Schedule from "./Schedule";
import ScheduleNew from "./ScheduleNew";

import { checkSession, logOut, getUserByKey } from "../utils/userUtils";
import { pingServer } from "../utils/commonUtils";
import { storeUpdateEmployees, cardScanned } from "../utils/employeeUtils";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "../styles/table.css";

import logo from "../images/logo.png";
import { FiLogOut } from "react-icons/fi";

class App extends React.Component {
	constructor() {
		super();

		this.state = {
			pingInterval: null,
			serverConnectionEstablished: false,
			scannerConnectionEstablished: false,
			loading: true,
			authenticated: false,
			user: {
				username: ""
			}
		}

		window.scanCard = cardScanned;
	}

	componentDidMount() {
		// Check user session before displaying anything
		this.establishConnection();
		this.setState({ 
			pingInterval: setInterval(() => {
				this.establishConnection();
			}, 1000)
		});
	}

	establishConnection = () => {
		pingServer().then((res) => {
			this.setState({
				serverConnectionEstablished: res.data.server,
				scannerConnectionEstablished: res.data.scanner,
			}, () => {
				checkSession().then((res) => {
					if(!production
						|| (this.state.serverConnectionEstablished === true
						&& this.state.scannerConnectionEstablished === true)) {
						clearInterval(this.state.pingInterval);
						this.setState({
							loading: false,
							authenticated: res.data,
						}, () => {
							if(this.state.authenticated) {
								this.onAuthentification();
								getUserByKey().then((res) => {
									this.setState({
										user: res.data,
									});
								});
							}
						});
					}
				});
			});
		});
	}
	
	onAuthentification = () => {
		storeUpdateEmployees();
		setInterval(() => {
			storeUpdateEmployees();
		}, employeeUpdateInterval);
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
					{
						this.state.serverConnectionEstablished
						? 	this.state.scannerConnectionEstablished
							? null
							: <div>Veido savienojumu ar NFC skeneri...</div>
						: <div>Veido savienojumu ar serveri...</div>
					}
				</div>
			);
		} else {
			if(this.state.authenticated) {
				// User interface
				return (
					<Router>
						<Container fluid={true}>
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
												<LinkContainer exact={true} to="/report">
													<Nav.Link>Atskaites</Nav.Link>
												</LinkContainer>
												<LinkContainer exact={true} to="/schedule">
													<Nav.Link>Grafiks</Nav.Link>
												</LinkContainer>
												<LinkContainer exact={true} to="/schedule_new">
													<Nav.Link>Grafiks NEW!</Nav.Link>
												</LinkContainer>
											</Nav>
											<Nav>
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
										<Route exact path="/report" component={Report} />
										<Route exact path="/schedule" component={Schedule} />
										<Route exact path="/schedule_new" component={ScheduleNew} />
										<Route component={NotFound} />
									</Switch>
									<ViewEmployee/>
									<RegisterEmployee/>
									<DeleteEmployee/>
									<EditEmployee/>
									<ExportExcel/>
									<CheckCard/>
									<CommentEmployee/>
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

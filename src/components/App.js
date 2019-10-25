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
import History from "./History";
import Notifications from "./Notifications";

import { checkSession, logOut, getUserByKey } from "../utils/userUtils";
import { pingServer } from "../utils/commonUtils";
import { storeUpdateEmployees, cardScanned } from "../utils/employeeUtils";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "../styles/table.css";

import logo from "../images/logo.png";
import { FiLogOut } from "react-icons/fi";
import { updateUser, updateNotifications, showNotifications, showHistory } from "../actions/employeeActions";
import { getNotifications } from "../utils/employeeUtils";

class App extends React.PureComponent {
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
									}, () => this.props.updateUser(this.state.user));
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
		getNotifications().then(res => {
			this.props.updateNotifications(res.data);
		});

		setInterval(() => {
			storeUpdateEmployees();
			getNotifications().then(res => {
				this.props.updateNotifications(res.data);
			});
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
				const unreadNotifications = this.props.notifications.notifications.filter((notification) => {
					const notificationDate = new Date(notification.date);
					return notificationDate.getFullYear() === new Date().getFullYear() &&
						notificationDate.getMonth() === new Date().getMonth() &&
						notificationDate.getDate() === new Date().getDate() &&
						!notification.type.includes("LOG");
				}).length;

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
												<Nav.Link onClick={this.props.showHistory}>
													Vēsture
												</Nav.Link>
												<Nav.Link 
													onClick={this.props.showNotifications} 
													style={{ position: "relative" }}
												>
													Paziņojumi
													{
														unreadNotifications ? (
															<div style={{ 
																position: "absolute", 
																right: "-10px", 
																top: 0,
																backgroundColor: "red",
																textAlign: "center",
																lineHeight: "19px",
																borderRadius: "50%",
																height: "20px",
																width: "20px",
																color: "white",
																fontSize: "12px"
															}}>
																{unreadNotifications}
															</div>
														)
														: null
													}
												</Nav.Link>
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
										<Route component={NotFound} />
									</Switch>
									<ViewEmployee/>
									<RegisterEmployee/>
									<DeleteEmployee/>
									<EditEmployee/>
									<ExportExcel/>
									<CheckCard/>
									<CommentEmployee/>
									<History/>
									<Notifications/>
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
		notifications: state.employees.notifications,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateUser: (user) => dispatch(updateUser(user)),
		showNotifications: () => dispatch(showNotifications()),
		updateNotifications: (data) => dispatch(updateNotifications(data)),
		showHistory: () => dispatch(showHistory()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

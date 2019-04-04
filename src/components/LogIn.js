import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import logo from "../images/logo.png";

import { authenticate } from "../utils/userUtils";

class LogIn extends React.Component {
	constructor() {
		super();

		this.state = {
			username: "",
			password: "",
			rememberMe: false,
			authenticationError: false,
		}
	}

	onUsernameChange = (event) => {
		this.setState({ username: event.target.value });
	}

	onPasswordChange = (event) => {
		this.setState({ password: event.target.value });
	}

	onRememberMeChange = (event) => {
		console.log(event.target.value);
		this.setState({ rememberMe: event.target.value });
	}

	logIn = (e) => {
		e.preventDefault();
		authenticate(this.state.username, this.state.password).then((res) => {
			if(res.data) {
				console.log("log in success");
				window.location.reload();
			} else {
				this.setState({
					authenticationError: true,
				});
				console.log("log in failure");
			}
		});
	}

	render() {
		return (
			<Modal 
				//size="sm"
				centered
				show={true}
				onHide={() => null}
			>
				<Form onSubmit={e => this.logIn(e)}>
				<Modal.Header className="justify-content-center">
					<Modal.Title>
						<img 
							src={logo}
							alt=""
							width="auto"
							height="40px"
							className="d-inline-block align-top mr-2"
							style={{filter: "invert(100%)"}}
						/>
						Autentifikācija
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form.Group>
						<Form.Label>Lietotājvārds</Form.Label>
						<Form.Control 
							required
							value={this.state.name} 
							onChange={this.onUsernameChange}
							name="username"
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Parole</Form.Label>
						<Form.Control 
							required
							value={this.state.surname} 
							onChange={this.onPasswordChange}
							name="password"
							type="password"
						/>
					</Form.Group>

					<Form.Group controlId="formBasicChecbox">
						<Form.Check 
							type="checkbox" 
							label="Atcerēties mani"
							name="rememberMe"
							checked={this.state.rememberMe}
							onChange={this.onRememberMeChange}/>
					</Form.Group>

					<Alert variant={"danger"} show={this.state.authenticationError} onClose={() => null}>
						Nepareizs lietotājvārds un/vai parole.
					</Alert>

				</Modal.Body>

				<Modal.Footer>
					<Button variant="success" type="submit">
						Ielogoties
					</Button>
				</Modal.Footer>
				</Form>
			</Modal>
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
)(LogIn);

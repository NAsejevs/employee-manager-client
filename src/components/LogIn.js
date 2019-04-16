import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import logo from "../images/logo.png";

import { authenticate } from "../utils/userUtils";

const DEBUG = true;

class LogIn extends React.Component {
	constructor() {
		super();

		this.state = {
			username: DEBUG ? "nils.asejevs" : "",
			password: DEBUG ? "EvoNils112" : "",
			rememberMe: true,
			authenticationError: false,
		}
	}

	componentDidMount() {
		if(DEBUG) {
			this.logIn();
		}
	}

	onUsernameChange = (event) => {
		this.setState({ username: event.target.value });
	}

	onPasswordChange = (event) => {
		this.setState({ password: event.target.value });
	}

	onRememberMeChange = () => {
		this.setState({ rememberMe: !this.state.rememberMe });
	}

	logIn = (e) => {
		if(DEBUG === false) {
			e.preventDefault();
		}
		authenticate(this.state.username, this.state.password, this.state.rememberMe).then((res) => {
			if(res.data) {
				window.location.reload();
			} else {
				this.setState({
					authenticationError: true,
				});
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
							value={this.state.username} 
							onChange={this.onUsernameChange}
							name="username"
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label>Parole</Form.Label>
						<Form.Control 
							required
							value={this.state.password} 
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

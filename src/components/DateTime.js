import React from "react";
import { Row, Col } from "react-bootstrap";

import { addZero } from "../utils/employeeUtils";

class DateTime extends React.Component {
	constructor() {
		super();

		this.state = {
			currentDate: null,
			currentTime: null,
		}
	}

	componentDidMount() {
		this.getDateTime();
		setInterval(() => {
			this.getDateTime();
		}, 1000);
	}

	getDateTime = () => {
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
		
		const displayDate = date.getFullYear().toString() + ". gada "
			+ date.getDate().toString() + ". "
			+ months[date.getMonth()].toLocaleLowerCase();

		const displayTime = " " 
			+ addZero(date.getHours()) + ":" 
			+ addZero(date.getMinutes());

		this.setState({
			currentDate: displayDate,
			currentTime: displayTime
		});
	}
	
	render() {
		return (
			<Row>
				<Col>
					{this.state.currentDate}
					{this.state.currentTime}
				</Col>
			</Row>
		);
	}
}

export default DateTime;

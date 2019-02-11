import React from "react";
import { Row, Col } from "react-bootstrap";

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

	addZero = (i) => {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
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
			+ this.addZero(date.getHours()) + ":" 
			+ this.addZero(date.getMinutes()) + ":" 
			+ this.addZero(date.getSeconds());

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

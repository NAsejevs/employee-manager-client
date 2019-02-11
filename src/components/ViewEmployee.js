import { connect } from "react-redux";
import React from "react";
import { Table } from "react-bootstrap";

import { addZero, getServerEmployee, getServerEmployeeWorkLog } from "../utils/utils";

import "../styles/main.css";

import ContainerBox from "./ContainerBox";

class ViewEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: this.props.match.params.id,
			employee: {
				name: " ",
				surname: " "
			},
			workLog: [],
			updateInterval: null,
		}
	}

	componentDidMount() {
		getServerEmployee(this.state.userId).then((res) => {
			this.setState({
				employee: res.data
			});
		});

		getServerEmployeeWorkLog(this.state.userId).then((res) => {
			this.setState({
				workLog: res.data
			});
		});

		const updateInterval = setInterval(() => {
			getServerEmployee(this.state.userId).then((res) => {
				this.setState({
					employee: res.data
				});
			});

			getServerEmployeeWorkLog(this.state.userId).then((res) => {
				this.setState({
					workLog: res.data
				});
			});
		}, 5000);

		this.setState({ updateInterval: updateInterval });
	}

	componentWillUnmount() {
		clearInterval(this.state.updateInterval);
	}

	render() {
		const workLog = this.state.workLog.map((log, index) => {
			const stillWorking = log.end_time === null ? true : false;
			const startTimePure = new Date(log.start_time);
			const endTimePure = stillWorking ? new Date() : new Date(log.end_time);

			const startTimeString = 
				// Date
				addZero(startTimePure.getDate()) + "." 
				+ addZero(startTimePure.getMonth() + 1) + "." 
				+ addZero(startTimePure.getFullYear()) + " "
				// Time
				+ addZero(startTimePure.getHours()) + ":" 
				+ addZero(startTimePure.getMinutes()) + ":" 
				+ addZero(startTimePure.getSeconds());

			const endTimeString = stillWorking ? " - " :
				// Date
				addZero(endTimePure.getDate()) + "." 
				+ addZero(endTimePure.getMonth() + 1) + "." 
				+ addZero(endTimePure.getFullYear()) + " "
				// Time
				+ addZero(endTimePure.getHours()) + ":" 
				+ addZero(endTimePure.getMinutes()) + ":" 
				+ addZero(endTimePure.getSeconds());

			// Calculate actual worked time
			let workTimeSeconds = Math.floor((endTimePure - (startTimePure))/1000);
			let workTimeMinutes = Math.floor(workTimeSeconds/60);
			let workTimeHours = Math.floor(workTimeMinutes/60);
			const workTimeDays = Math.floor(workTimeHours/24);

			workTimeHours = workTimeHours-(workTimeDays*24);
			workTimeMinutes = workTimeMinutes-(workTimeDays*24*60)-(workTimeHours*60);
			workTimeSeconds = workTimeSeconds-(workTimeDays*24*60*60)-(workTimeHours*60*60)-(workTimeMinutes*60);
			
			const workTimeString =
				+ workTimeHours + " st. "
				+ workTimeMinutes + " min. "
				+ workTimeSeconds + " sek. ";

			const workingStyle = {
				backgroundColor: "#ffffe6",
			}

			return (
				<tr key={index} style={stillWorking ? workingStyle : null}>
					<td>{startTimeString}</td>
					<td>{endTimeString}</td>
					<td>{workTimeString}</td>
				</tr>
			);
		});

		return (
			<ContainerBox header={this.state.employee.name + " " + this.state.employee.surname}>
				<Table hover>
					<thead>
						<tr>
							<th>ATSKAITE SĀKTA</th>
							<th>ATSKAITE BEIGTA</th>
							<th>NOSTRĀDĀTS</th>
						</tr>
					</thead>
					<tbody>
						{workLog}
					</tbody>
				</Table>
			</ContainerBox>
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
)(ViewEmployee);

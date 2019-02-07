import { connect } from 'react-redux';
import React from 'react';
import { Modal, Table } from 'react-bootstrap';

import { getServerEmployee, getServerEmployeeWorkLog } from '../utils/utils';

import '../styles/main.css';

class ViewEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: this.props.match.params.id,
			employee: {},
			workLog: [],
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

		setInterval(() => {
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
		}, 1000);
	}

	addZero = (i) => {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	render() {
		const workLog = this.state.workLog.map((log, index) => {
			const stillWorking = log.end_time === null ? true : false;
			const startTimePure = new Date(log.start_time);
			const endTimePure = stillWorking ? new Date() : new Date(log.end_time);

			const startTimeString = 
				// Date
				+ this.addZero(startTimePure.getDate()) + "." 
				+ this.addZero(startTimePure.getMonth() + 1) + "." 
				+ this.addZero(startTimePure.getFullYear()) + " "
				// Time
				+ this.addZero(startTimePure.getHours()) + ":" 
				+ this.addZero(startTimePure.getMinutes()) + ":" 
				+ this.addZero(startTimePure.getSeconds());

			const endTimeString = stillWorking ? " - " :
				// Date
				this.addZero(endTimePure.getDate()) + "." 
				+ this.addZero(endTimePure.getMonth() + 1) + "." 
				+ this.addZero(endTimePure.getFullYear()) + " "
				// Time
				+ this.addZero(endTimePure.getHours()) + ":" 
				+ this.addZero(endTimePure.getMinutes()) + ":" 
				+ this.addZero(endTimePure.getSeconds());

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
			<Modal.Dialog className="modalContainer">
				<Modal.Header>
					<Modal.Title>{this.state.employee.name + " " + this.state.employee.surname}</Modal.Title>
				</Modal.Header>
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
			</Modal.Dialog>
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

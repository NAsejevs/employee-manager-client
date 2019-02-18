import { connect } from "react-redux";
import React from "react";
import { Table, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";

import { addZero, getServerEmployee, getServerEmployeeWorkLog } from "../utils/utils";

import "react-datepicker/dist/react-datepicker.css";

import "../styles/main.css";

class ViewEmployee extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			employee: {
				name: "Ielādē...",
				surname: " "
			},
			workLog: [],
			updateInterval: null,
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.userId !== prevProps.userId && this.props.userId !== null) {
			this.fetchWorkLog();
		}
	}

	componentWillUnmount() {
		clearInterval(this.state.updateInterval);
	}

	fetchWorkLog = () => {
		const userId = this.props.userId;

		getServerEmployee(this.props.userId).then((res) => {
			if(this.props.userId !== userId) return;
			this.setState({
				employee: res.data
			});
		});

		getServerEmployeeWorkLog(this.props.userId).then((res) => {
			if(this.props.userId !== userId) return;
			this.setState({
				workLog: res.data
			});
		});

		this.setState({ 
			updateInterval: setInterval(() => {
				getServerEmployee(this.props.userId).then((res) => {
					if(this.props.userId !== userId) return;
					this.setState({
						employee: res.data
					});
				});

				getServerEmployeeWorkLog(this.props.userId).then((res) => {
					if(this.props.userId !== userId) return;
					this.setState({
						workLog: res.data
					});
				});
			}, 5000)
		});
	}

	onModalHide = () => {
		clearInterval(this.state.updateInterval);

		this.setState({
			employee: {
				name: "Ielādē...",
				surname: " "
			},
			workLog: []
		});
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
				+ addZero(startTimePure.getMinutes());

			const endTimeString = stillWorking ? " - " :
				// Date
				addZero(endTimePure.getDate()) + "." 
				+ addZero(endTimePure.getMonth() + 1) + "." 
				+ addZero(endTimePure.getFullYear()) + " "
				// Time
				+ addZero(endTimePure.getHours()) + ":" 
				+ addZero(endTimePure.getMinutes());

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
				+ workTimeMinutes + " min. ";

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
			<Modal 
				show={this.props.showWorkLogModal} 
				onHide={() => { 
					this.props.handleWorkLogClose()
					this.onModalHide()
				}} 
				size={"lg"}
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.state.employee.name + " " + this.state.employee.surname}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<DatePicker
						selected={new Date()}
						selectsStart
						startDate={new Date()}
						endDate={new Date()}
						onChange={this.handleChangeStart}
						className="form-control"
					/>

					<DatePicker
						selected={new Date()}
						selectsEnd
						startDate={new Date()}
						endDate={this.state.endDate}
						onChange={this.handleChangeEnd}
						className="form-control"
					/>
					{
						this.state.workLog.length
						? (
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
						</Table>)
						: " "
					}
				</Modal.Body>
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
)(ViewEmployee);

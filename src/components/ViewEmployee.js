import { connect } from "react-redux";
import React from "react";
import { Table, Modal, Dropdown, DropdownButton, Col, Row, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { addZero, getServerEmployee, getServerEmployeeWorkLog } from "../utils/utils";

import BoostrapDatePicker from "./BoostrapDatePicker";

import "../styles/main.css";

class ViewEmployee extends React.Component {
	constructor(props) {
		super(props);

		const startDate = new Date();
		startDate.setHours(0,0,0);

		const endDate = new Date();
		endDate.setHours(23,59,59);

		this.state = {
			employee: {
				name: "Ielādē...",
				surname: " "
			},
			workLog: [],
			results: 0,
			updateInterval: null,
			startDate: startDate,
			endDate: endDate,
			dropdown: {
				currentFilter: "Šodiena",
				filters: ["Šodiena", "Vakardiena", "Pēdējās 7 dienas", "Pēdējās 30 dienas"]
			}
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

	handleDateChangeStart = (date) => {
		const startOfDay = new Date(date);
		startOfDay.setHours(0,0,0);
		this.setState({
			startDate: startOfDay,
		});
	}

	handleDateChangeEnd = (date) => {
		const endOfDay = new Date(date);
		endOfDay.setHours(23,59,59);
		this.setState({
			endDate: endOfDay,
		});
	}

	onClickFilter = (index) => {
		switch(index) {
			case 0: {
				this.handleDateChangeStart(new Date());
				this.handleDateChangeEnd(new Date());
				break;
			}
			case 1: {
				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);
				this.handleDateChangeStart(yesterday);
				this.handleDateChangeEnd(yesterday);
				break;
			}
			case 2: {
				const last7Days = new Date();
				last7Days.setDate(last7Days.getDate() - 7);
				this.handleDateChangeStart(last7Days);
				this.handleDateChangeEnd(new Date());
				break;
			}
			case 3: {
				const last30Days = new Date();
				last30Days.setDate(last30Days.getDate() - 30);
				this.handleDateChangeStart(last30Days);
				this.handleDateChangeEnd(new Date());
				break;
			}
			default: {
				this.handleDateChangeStart(new Date());
				this.handleDateChangeEnd(new Date());
				break;
			}
		}

		this.setState({
			dropdown: {
				...this.state.dropdown,
				currentFilter: this.state.dropdown.filters[index],
			}			
		})
	}

	render() {
		let filterResults = 0;
		const workLog = this.state.workLog
		.filter((log) => {
			// Filter out all rows which do not match the date
			const startTimePure = new Date(log.start_time);

			if(startTimePure < this.state.startDate || startTimePure > this.state.endDate) {
				return false;
			}
			filterResults++;
			return true;
		})
		.map((log, index) => {
			// Format the remaining filtered work logs
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
				onHide={() => this.props.handleWorkLogClose()}
				onExited={() => this.onModalHide()}
				size={"lg"}
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.state.employee.name + " " + this.state.employee.surname}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form>
						<Row>
							<Col sm={4}>
								<Form.Group as={Row}>
									<Form.Label column sm={2}>No</Form.Label>
									<Col sm={10}>
										<DatePicker
											dateFormat="yyyy/MM/dd"
											customInput={<BoostrapDatePicker />}
											selected={this.state.startDate}
											onChange={this.handleDateChangeStart}
											maxDate={new Date()}
										/>
									</Col>
								</Form.Group>
							</Col>
							<Col sm={4}>
								<Form.Group as={Row}>
									<Form.Label column sm={2}>Līdz</Form.Label>
									<Col sm={10}>
										<DatePicker
											dateFormat="yyyy/MM/dd"
											customInput={<BoostrapDatePicker />}
											selected={this.state.endDate}
											onChange={this.handleDateChangeEnd}
											maxDate={new Date()}
										/>
									</Col>
								</Form.Group>
							</Col>
							<Col sm={4}>
								<DropdownButton
									variant="secondary"
									title={this.state.dropdown.currentFilter} 
									className="text-right"
								>
								{
									this.state.dropdown.filters.map((filter, index) => {
										return <Dropdown.Item key={index} onClick={() => this.onClickFilter(index)}>{filter}</Dropdown.Item>
									})
								}
								</DropdownButton>
							</Col>
						</Row>
					</Form>
					{
						this.state.workLog.length && filterResults
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
						</Table>
						) : (
							<div className="text-center">
								Netika atrasts neviens ieraksts...
							</div>
						)
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

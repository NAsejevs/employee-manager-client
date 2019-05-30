import { connect } from "react-redux";
import React from "react";
import { Table, Modal, Dropdown, DropdownButton, Col, Row, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { showEmployeeWorkLog, hideEmployeeWorkLog } from "../actions/employeeActions";

import { getServerEmployee, getServerEmployeeWorkLog } from "../utils/employeeUtils";
import { addZero, millisecondConverter } from "../utils/commonUtils";

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
		if (this.props.employeeWorkLog.id !== prevProps.employeeWorkLog.id && this.props.employeeWorkLog.id !== null) {
			this.fetchWorkLog();
		}
	}

	componentWillUnmount() {
		clearInterval(this.state.updateInterval);
	}

	fetchWorkLog = () => {
		getServerEmployee(this.props.employeeWorkLog.id).then((res) => {
			this.setState({
				employee: res.data
			});
		});

		getServerEmployeeWorkLog(this.props.employeeWorkLog.id, "DESC").then((res) => {
			this.setState({
				workLog: res.data
			});
		});

		this.setState({
			updateInterval: setInterval(() => {
				getServerEmployee(this.props.employeeWorkLog.id).then((res) => {
					this.setState({
						employee: res.data
					});
				});

				getServerEmployeeWorkLog(this.props.employeeWorkLog.id, "DESC").then((res) => {
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
		let lastDate = null;
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

			const startTimeFormatted = 
				  addZero(startTimePure.getHours()) + ":" 
				+ addZero(startTimePure.getMinutes());

			const endTimeFormatted = stillWorking ? " - " :
				  addZero(endTimePure.getHours()) + ":" 
				+ addZero(endTimePure.getMinutes());

			const workTime = millisecondConverter(endTimePure - startTimePure);
			const workTimeFormatted =
				+ workTime.hours + " st. "
				+ workTime.minutes + " min. ";

			const workingStyle = {
				backgroundColor: "#ffffe6",
			}

			const workRow = (
				<tr className="text-center" style={stillWorking ? workingStyle : null}>
					<td>{startTimeFormatted}</td>
					<td>{endTimeFormatted}</td>
					<td>{workTimeFormatted}</td>
				</tr>
			);

			let dateRow = null;

			if(lastDate === null || lastDate !== startTimePure.getDate()) {
				lastDate = startTimePure.getDate();

				const startDateFormatted =
					  addZero(startTimePure.getDate()) + "." 
					+ addZero(startTimePure.getMonth() + 1) + "." 
					+ addZero(startTimePure.getFullYear());

				dateRow = (
					<tr className="bg-dark text-light">
						<td colSpan={3}>{startDateFormatted}</td>
					</tr>
				);
			}

			return (
				<tbody key={index}>
					{dateRow}
					{workRow}
				</tbody>
			);
		});

		return (
			<Modal 
				show={this.props.employeeWorkLog.show} 
				onHide={this.props.hideEmployeeWorkLog}
				onExited={this.onModalHide}
				size={"lg"}
			>
				<Modal.Header closeButton>
					<Modal.Title className="w-100">
						<Row>
							<Col>
								<h4>{this.state.employee.name + " " + this.state.employee.surname} ({this.state.employee.personalCode})</h4>
							</Col>
						</Row>
						<Row>
							<Col>
								<h5 className="text-secondary">{this.state.employee.position}</h5>
							</Col>
							<Col>
								<h5 className="text-secondary float-right">Tel. {this.state.employee.number}</h5>
							</Col>
						</Row>
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form>
						<Row>
							<Col>
								<Form.Group as={Row}>
									<Form.Label column xs={2}>No</Form.Label>
									<Col xs={10}>
										<DatePicker
											dateFormat="yyyy.MM.dd"
											customInput={<BoostrapDatePicker />}
											selected={this.state.startDate}
											onChange={this.handleDateChangeStart}
											maxDate={new Date()}
										/>
									</Col>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group as={Row}>
									<Form.Label column xs={2}>Līdz</Form.Label>
									<Col xs={10}>
										<DatePicker
											dateFormat="yyyy.MM.dd"
											customInput={<BoostrapDatePicker />}
											selected={this.state.endDate}
											onChange={this.handleDateChangeEnd}
											minDate={this.state.startDate}
											maxDate={new Date()}
										/>
									</Col>
								</Form.Group>
							</Col>
							<Col className="d-flex flex-column">
								<DropdownButton
									variant="secondary"
									title={this.state.dropdown.currentFilter} 
									className="text-right mt-auto mb-3"
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
						<Table size="sm">
							<thead>
								<tr className="text-center">
									<th>Ienāca</th>
									<th>Izgāja</th>
									<th>Nostrādāja</th>
								</tr>
							</thead>
							{workLog}
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
		employeeWorkLog: state.employees.employeeWorkLog,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showEmployeeWorkLog: () => dispatch(showEmployeeWorkLog()),
		hideEmployeeWorkLog: () => dispatch(hideEmployeeWorkLog()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewEmployee);

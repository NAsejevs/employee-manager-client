import { connect } from "react-redux";
import React from "react";
import { Table, Modal, Dropdown, DropdownButton, Col, Row, Form, Button } from "react-bootstrap";
import BoostrapDatePicker from "./BoostrapDatePicker";

import { workLogUpdateInterval } from "../utils/config";

import { hideEmployeeWorkLog } from "../actions/employeeActions";

import { getServerEmployee, getServerEmployeeWorkLog, deleteServerWorkLog, editServerWorkLog } from "../utils/employeeUtils";
import { addZero, millisecondConverter } from "../utils/commonUtils";

import { FiTrash, FiEdit, FiX, FiCheck } from "react-icons/fi";

class ViewEmployee extends React.Component {
	constructor(props) {
		super(props);

		const startDate = new Date();
		startDate.setHours(0, 0, 0);

		const endDate = new Date();
		endDate.setHours(23, 59, 59);

		this.state = {
			employee: {
				name: "Ielādē...",
				surname: " "
			},
			workLog: [],
			editWorkLog: {
				id: null,
				startDate: null,
				endDate: null,
				working: false,
			},
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
			}, workLogUpdateInterval)
		});
	}

	onModalHide = () => {
		clearInterval(this.state.updateInterval);

		this.setState({
			employee: {
				name: "Ielādē...",
				surname: " "
			},
			workLog: [],
			editWorkLog: {
				id: null,
				startDate: null,
				endDate: null,
				working: false,
			},
		});
	}

	handleDateChangeStart = (date) => {
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0);
		this.setState({
			startDate: startOfDay,
		});
	}

	handleDateChangeEnd = (date) => {
		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59);
		this.setState({
			endDate: endOfDay,
		});
	}

	onClickFilter = (index) => {
		switch (index) {
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

	deleteWorkLog = (id, working, employeeId) => {
		deleteServerWorkLog(id, working, employeeId).then(() => {
			this.fetchWorkLog();
		});
	}

	editWorkLog = (id, startDate, endDate, working) => {
		this.setState({
			editWorkLog: {
				...this.state.editWorkLog,
				id: id,
				startDate: startDate,
				endDate: endDate,
				working: working,
			},
		});
	}

	confirmEditWorkLog = () => {
		editServerWorkLog(
			this.state.editWorkLog.id,
			this.state.editWorkLog.startDate,
			this.state.editWorkLog.endDate,
			this.state.editWorkLog.working).then(() => {
				this.setState({
					editWorkLog: {
						id: null,
						startDate: null,
						endDate: null,
						working: false,
					},
				}, () => {
					this.fetchWorkLog();
				});
			});
	}

	cancelEditWorkLog = () => {
		this.setState({
			editWorkLog: {
				id: null,
				startDate: null,
				endDate: null,
				working: false,
			},
		});
	}

	onStartDateChange = (date) => {
		this.setState({
			editWorkLog: {
				...this.state.editWorkLog,
				startDate: date
			}
		});
	}

	onEndDateChange = (date) => {
		this.setState({
			editWorkLog: {
				...this.state.editWorkLog,
				endDate: date
			}
		});
	}

	render() {
		let filterResults = 0;
		let lastStartDate = null;
		let totalDayWorkTime = 0;
		let totalWorkTime = 0;
		let totalDays = 0;

		const workLogFiltered = this.state.workLog
			.filter((log) => {
				// Filter out all rows which do not match the date
				const startTimePure = new Date(log.start_time);

				if (startTimePure < this.state.startDate || startTimePure > this.state.endDate) {
					return false;
				}
				filterResults++;
				return true;
			});

		const workLog = workLogFiltered
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
				totalDayWorkTime += (endTimePure - startTimePure);
				totalWorkTime += (endTimePure - startTimePure);
				const workTimeFormatted =
					+ workTime.hours + " st. "
					+ workTime.minutes + " min. ";

				const workingStyle = {
					backgroundColor: "#ffffe6",
				}

				const commands = (
					<Row className="text-center">
						<Col>
							{
								this.state.editWorkLog.id === log.id
									? <>
										<Button
											size={"sm"}
											variant="link"
											onClick={() => this.confirmEditWorkLog()}
										>
											<FiCheck className="mb-1" />
										</Button>
										<Button
											size={"sm"}
											variant="link"
											onClick={() => this.cancelEditWorkLog()}
										>
											<FiX className="mb-1" />
										</Button>
									</>
									: <>
										<Button
											size={"sm"}
											variant="link"
											onClick={() => this.editWorkLog(log.id, log.start_time, log.end_time, stillWorking)}
										>
											<FiEdit className="mb-1" />
										</Button>
										<Button
											size={"sm"}
											variant="link"
											onClick={() => this.deleteWorkLog(log.id, stillWorking, log.employee_id)}
										>
											<FiTrash className="mb-1" />
										</Button>
									</>
							}
						</Col>
					</Row>
				);

				const workRow = (
					<tr className="text-center" style={stillWorking ? workingStyle : null}>
						<td></td>
						<td>
							{
								this.state.editWorkLog.id === log.id
									? <BoostrapDatePicker
										dateFormat="dd.MM.yyyy. HH:mm"
										selected={new Date(this.state.editWorkLog.startDate)}
										onChange={this.onStartDateChange}
										timeIntervals={1}
										showTimeSelect
										timeFormat="HH:mm"
									/>
									: startTimeFormatted
							}
						</td>
						<td>
							{
								this.state.editWorkLog.id === log.id && !stillWorking
									? <BoostrapDatePicker
										dateFormat="dd.MM.yyyy. HH:mm"
										selected={new Date(this.state.editWorkLog.endDate)}
										onChange={this.onEndDateChange}
										timeIntervals={1}
										showTimeSelect
										timeFormat="HH:mm"
									/>
									: endTimeFormatted
							}
						</td>
						<td>{workTimeFormatted}</td>
						<td>{commands}</td>
					</tr>
				);

				let dateRow = null;
				let totalDayRow = null;
				let totalRow = null;

				if (lastStartDate === null || lastStartDate !== startTimePure.getDate()) {
					lastStartDate = startTimePure.getDate();

					const dateFormatted =
						addZero(startTimePure.getDate()) + "."
						+ addZero(startTimePure.getMonth() + 1) + "."
						+ addZero(startTimePure.getFullYear());

					dateRow = (
						<tr className="bg-dark text-light">
							<td style={{ width: "100px" }}><b>{dateFormatted}</b></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					);
				}

				let nextStartDate = null;

				if (workLogFiltered[index + 1]) {
					nextStartDate = new Date(workLogFiltered[index + 1].start_time).getDate();
				}

				if (nextStartDate !== startTimePure.getDate()) {
					const totalDayWorkTimeConverted = millisecondConverter(totalDayWorkTime);

					const totalDayWorkTimeFormatted =
						+ totalDayWorkTimeConverted.hours + " st. "
						+ totalDayWorkTimeConverted.minutes + " min. ";

					totalDayRow = (
						<tr className="bg-light text-dark">
							<td><b>KOPĀ</b></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="text-center"><b>{totalDayWorkTimeFormatted}</b></td>
						</tr>
					);

					totalDays++;
					totalDayWorkTime = 0;
				}

				if (totalDays > 1 && nextStartDate === null) {
					const totalWorkTimeConverted = millisecondConverter(totalWorkTime);

					const totalWorkTimeFormatted =
						+ totalWorkTimeConverted.hours + " st. "
						+ totalWorkTimeConverted.minutes + " min. ";

					const fromDateFormatted =
						addZero(this.state.startDate.getDate()) + "."
						+ addZero(this.state.startDate.getMonth() + 1) + "."
						+ addZero(this.state.startDate.getFullYear());

					const toDateFormatted =
						addZero(this.state.endDate.getDate()) + "."
						+ addZero(this.state.endDate.getMonth() + 1) + "."
						+ addZero(this.state.endDate.getFullYear());


					totalRow = (
						<tr className="text-dark">
							<td colSpan={2}><b>{fromDateFormatted} - {toDateFormatted}</b></td>
							<td></td>
							<td></td>
							<td className="text-center"><b>{totalWorkTimeFormatted}</b></td>
						</tr>
					);

					totalWorkTime = 0;
				}

				return (
					<tbody key={index}>
						{dateRow}
						{workRow}
						{totalDayRow}
						{totalRow}
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
								<h4>
									{this.state.employee.name + " " + this.state.employee.surname}
									{this.state.employee.personalCode
										? " (" + this.state.employee.personalCode + ")"
										: null
									}
								</h4>
							</Col>
						</Row>
						<Row>
							<Col>
								<h5 className="text-secondary">{this.state.employee.company}</h5>
							</Col>
						</Row>
						<Row>
							<Col>
								<h5 className="text-secondary">{this.state.employee.position}</h5>
							</Col>
							<Col className="text-right">
								<h5 className="text-secondary">
									{this.state.employee.number
										? "Tel. " + this.state.employee.number
										: null
									}
								</h5>
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
										<BoostrapDatePicker
											dateFormat="dd.MM.yyyy."
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
										<BoostrapDatePicker
											dateFormat="dd.MM.yyyy."
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
											<th></th>
											<th>Ienāca</th>
											<th>Izgāja</th>
											<th>Nostrādāja</th>
											<th></th>
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
		hideEmployeeWorkLog: () => dispatch(hideEmployeeWorkLog()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewEmployee);

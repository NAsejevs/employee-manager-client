import { connect } from "react-redux";
import React from "react";

import { DropdownButton, Form, Button, Row, Col, Dropdown } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import BoostrapDatePicker from "./BoostrapDatePicker";

import ContainerBox from "./ContainerBox";

import { 
	updateEmployees,
	showEmployeeWorkLog
} from "../actions/employeeActions";

import {
	getServerEmployeeWorkLogFromTo,
	getEmployeeComments,
} from "../utils/employeeUtils";
import { addZero, millisecondConverter } from "../utils/commonUtils";

class Employees extends React.Component {

	constructor() {
		super();

		const startDate = new Date();
		startDate.setHours(0,0,0);

		const endDate = new Date();
		endDate.setHours(23,59,59);

		this.state = {
			workLogUserId: null,
			showWorkLogModal: false,
			updateInterval: null,
			tableData: [],
			filter: {
				type: "",
				filters: "",
			},
			showFilters: false,
			showArchive: false,
			showInactive: false,
			nameFilter: "",
			positionFilter: "",
			startDate: startDate,
			endDate: endDate,
			dropdown: {
				currentFilter: "Šodiena",
				filters: ["Šodiena", "Vakardiena", "Pēdējās 7 dienas", "Pēdējās 30 dienas"]
			}
		}
	}

	componentDidMount() {
		//getEmployees();

		this.setState({
			updateInterval: (
				setInterval(() => {
					//getEmployees();
				}, 5000)
			),
		});
	}

	componentWillUnmount() {
		clearInterval(this.state.updateInterval);
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.employees !== this.props.employees
			|| prevState.showArchive !== this.state.showArchive
			|| prevState.showInactive !== this.state.showInactive
			|| prevState.nameFilter !== this.state.nameFilter
			|| prevState.positionFilter !== this.state.positionFilter
			|| prevState.startDate !== this.state.startDate
			|| prevState.endDate !== this.state.endDate) {
			this.onTableChange();
		}
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

	onTableChange = () => {
		this.formatTable(() => {
			this.applyNameFilter(() => {
				this.applyPositionFilter();
			});
		});
	}

	applyNameFilter = (callback = () => null) => {
		const result = this.state.tableData.filter((row) => {
			return (row.name.name + " " + row.name.surname).toString().toLowerCase().indexOf(this.state.nameFilter.toLowerCase()) > -1;
		});

		this.setState({
			tableData: result
		}, callback);
	}

	applyPositionFilter = (callback = () => null) => {
		const result = this.state.tableData.filter((row) => {
			const position = row.position ? row.position : "";

			return (position).toString().toLowerCase().indexOf(this.state.positionFilter.toLowerCase()) > -1;
		});

		this.setState({
			tableData: result
		}, callback);
	}

	formatTable = (callback = () => null) => {
		const employees = this.props.employees.filter((employee) => {
			if(employee.archived && !this.state.showArchive) {
				return false;
			}
			if(!employee.active && !this.state.showInactive) {
				return false;
			}
			return true;
		});

		const workLogFrom = new Date(this.state.startDate);

		const workLogTo = new Date(this.state.endDate);

		const promise = employees.map((employee) => {
			return getServerEmployeeWorkLogFromTo(employee.id, workLogFrom, workLogTo).then((workLogs) => {
				return getEmployeeComments(employee.id).then((comments) => {
					return({
						id: employee.id,
						position: employee.position ? employee.position.toString() : null,
						name: {
							id: employee.id,
							name: employee.name,
							surname: employee.surname,
							working: employee.working,
							comments: comments.data,
						},
						today: {
							working: employee.working,
							workLogs: workLogs.data,
							startDate: this.state.startDate,
							endDate: this.state.endDate,
						},
						commands: employee,
					});
				});
			});
		});

		Promise.all(promise).then((res) => {
			this.setState({ tableData: res,
			}, () => {
				callback();
			});
		});
	}

	onToggleArchive = () => {
		this.setState({ showArchive: !this.state.showArchive });
	}

	onToggleInactive = () => {
		this.setState({ showInactive: !this.state.showInactive });
	}

	onToggleFilters = () => {
		this.setState({ showFilters: !this.state.showFilters });
	}

	onChangeNameFilter = (e) => {
		this.setState({ nameFilter: e.target.value });
	}

	onChangePositionFilter = (e) => {
		this.setState({ positionFilter: e.target.value });
	}

	clearAllFilters = () => {
		const startDate = new Date();
		startDate.setHours(0,0,0);

		const endDate = new Date();
		endDate.setHours(23,59,59);

		this.setState({
			nameFilter: "",
			positionFilter: "",
			showArchive: false,
			showInactive: false,
			startDate: startDate,
			endDate: endDate,
			dropdown: {
				currentFilter: "Šodiena",
				filters: ["Šodiena", "Vakardiena", "Pēdējās 7 dienas", "Pēdējās 30 dienas"]
			}
		});
	}

	render() {
		const nameFormatter = (cell, row) => {
			return (
				<div>
					<nobr>
						<Button 
							variant="link" 
							onClick={() => this.props.showEmployeeWorkLog(cell.id)}
							style={{ color: "#0000FF" }}
						>
							{cell.name + " " + cell.surname}
						</Button>
					</nobr>
				</div>
			);
		};

		const todayFormatter = (cell, row) => {
			let badges = [];
			let totalWorkTime = 0;
			let totalWorkTimeConverted = {
				hours: 0,
				minutes: 0,
				seconds: 0
			};

			const displayOneDay = cell.endDate - cell.startDate < 86400000;

			cell.workLogs.forEach((workLog, index) => {
				let workTime = 0;
				let workTimeConverted = {
					hours: 0,
					minutes: 0,
					seconds: 0
				};

				if(workLog.end_time === null) {
					workLog.end_time = new Date();
				}

				// Calculate each row data
				workTime = new Date(workLog.end_time) - new Date(workLog.start_time);
				workTimeConverted = millisecondConverter(workTime);

				const workTimeStartFormatted =
					addZero(new Date(workLog.start_time).getHours()) + ":" 
					+ addZero(new Date(workLog.start_time).getMinutes());
				
				const workTimeEndFormatted =
					addZero(new Date(workLog.end_time).getHours()) + ":" 
					+ addZero(new Date(workLog.end_time).getMinutes());
	
				const workTimeFormatted =
					workTimeConverted.hours + " st. " 
					+ workTimeConverted.minutes + " min. ";

				// Calculate the total
				totalWorkTime += new Date(workLog.end_time) - new Date(workLog.start_time);
				totalWorkTimeConverted = millisecondConverter(totalWorkTime);

				if(displayOneDay) {
					// Each work log entry formatted and applied in HTML format
					badges.push(
						<Row key={index} style={{ fontSize: "14px" }}>
							<Col xs="4">
								<span>
									Ienāca: {workTimeStartFormatted}
								</span>
							</Col>
							<Col xs="4">
								{
									cell.working && index === cell.workLogs.length - 1
									? null
									: <span>
										Izgāja: {workTimeEndFormatted}
									</span>
								}
							</Col>
							<Col xs="4" className="text-center">
								{
									workTimeFormatted !== null
									? <span>
										{workTimeFormatted}
									</span>
									: null
								}
							</Col>
						</Row>
					);
				}
			});

			//Total row formatted
			if(badges.length && displayOneDay) {
				const totalWorkTimeFormatted =
				totalWorkTimeConverted.hours + " st. " 
				+ totalWorkTimeConverted.minutes + " min. ";

				badges.push(
					<Row key={badges.length} style={{ fontSize: "14px" }}>
						<Col xs="4">
						</Col>
						<Col xs="4">
						</Col>
						<Col xs="4" className="text-center" style={{ borderTop: "solid 1px" }}>
							{
								totalWorkTimeFormatted !== null
								? <span>
									<b>{totalWorkTimeFormatted}</b>
								</span>
								: null
							}
						</Col>
					</Row>
				);
			} else if(!displayOneDay) {
				const totalWorkTimeFormatted =
				totalWorkTimeConverted.hours + " st. " 
				+ totalWorkTimeConverted.minutes + " min. ";

				badges.push(
					<Row key={badges.length} style={{ fontSize: "14px" }}>
						<Col className="text-center">
							{
								totalWorkTimeFormatted !== null
								? <span>
									{totalWorkTimeFormatted}
								</span>
								: null
							}
						</Col>
						<Col xs="4">
						</Col>
						<Col xs="4">
						</Col>
					</Row>
				);
			}

			return (badges);
		};

		const startDateFormatted = 
			  addZero(this.state.startDate.getDate()) + "." 
			+ addZero(this.state.startDate.getMonth() + 1) + "." 
			+ addZero(this.state.startDate.getFullYear());


		const endDateFormatted =
			  addZero(this.state.endDate.getDate()) + "." 
			+ addZero(this.state.endDate.getMonth() + 1) + "." 
			+ addZero(this.state.endDate.getFullYear());

		const dateRange = startDateFormatted + (startDateFormatted === endDateFormatted ? "" : " - " + endDateFormatted);

		const columns = [{
			dataField: "id",
			text: "#",
			sort: true,
			// hidden: true,
		}, {
			dataField: "name",
			text: "Vārds",
			sort: true,
			sortFunc: (a, b, order) => {
				if(a.name < b.name) {
					return order === "asc" ? 1 : -1;
				} else if(a.name > b.name) {
					return order === "asc" ? -1 : 1;
				}
				return 0;
			},
			classes: "align-middle",
			formatter: nameFormatter,
		}, {
			dataField: "today",
			text: dateRange,
			sort: true,
			sortFunc: (a, b, order) => {
				const aData = a.working
				? new Date(a.workLogs[a.workLogs.length - 1].start_time)
				: new Date(a.workLogs[a.workLogs.length - 1].end_time);

				const bData = b.working
				? new Date(b.workLogs[b.workLogs.length - 1].start_time)
				: new Date(b.workLogs[b.workLogs.length - 1].end_time);

				if(aData > bData) {
					return order === "asc" ? 1 : -1;
				} else if(aData < bData) {
					return order === "asc" ? -1 : 1;
				}
				return 0;
			},
			classes: "align-middle",
			formatter: todayFormatter
		}];

		const defaultSorted = [{
			dataField: "id",
			order: "asc"
		}];

		const paginationTotalRenderer = (from, to, size) => {
			if(to === 0) {
				return(
					<span className="react-bootstrap-table-pagination-total">
						&nbsp;Netika atrasts neviens rezultāts
					</span>
				);
			}

			return(
				<span className="react-bootstrap-table-pagination-total">
					&nbsp;Rāda { to-from+1 } no { size } rezultātiem
				</span>
			);
		}

		const pagination = paginationFactory({
			page: 1,
			alwaysShowAllBtns: true,
			showTotal: true,
			sizePerPage : 10,
			paginationTotalRenderer: paginationTotalRenderer,
			sizePerPageList: [
				{
					text: "10",
					value: 10,
				},{
					text: "25",
					value: 25,
				},{
					text: "50",
					value: 50,
				},{
					text: "100",
					value: 100,
				},{
					text: "Visi",
					value: this.state.tableData.length,
				}
			]
		});

		const rowStyle = (row) => {
			if(!row.commands.active) {
				return { backgroundColor: "rgba(255, 0, 0, 0.1)" };
			}

			if(row.commands.archived) {
				return { backgroundColor: "rgba(255, 255, 0, 0.1)" };
			}
		};

		return (
			<ContainerBox header={"Atskaites"}>
				<Form>
					<Row>
						<Col>
							<Form.Group>
								<Form.Check 
									type="checkbox" 
									label="Rādīt arhīvā esošos darbiniekus"
									checked={this.state.showArchive}
									onChange={this.onToggleArchive}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Check 
									type="checkbox" 
									label="Rādīt deaktivizētus darbiniekus"
									checked={this.state.showInactive}
									onChange={this.onToggleInactive}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Control
									placeholder="Vārds..."
									onChange={this.onChangeNameFilter}
									value={this.state.nameFilter}
								/>
								<Form.Text>
									Meklēt darbinieku pēc vārda vai uzvārda
								</Form.Text>
							</Form.Group>
							<Form.Group>
								<Form.Control
									placeholder="Amats..."
									onChange={this.onChangePositionFilter}
									value={this.state.positionFilter}
								/>
								<Form.Text>
									Meklēt darbinieku pēc amata
								</Form.Text>
							</Form.Group>
						</Col>
					</Row>
					<Row className="mt-4">
						<Col xs={"auto"}>
							<Form.Group as={Row}>
								<Form.Label column xs={"auto"}>Dati no</Form.Label>
								<Col>
									<BoostrapDatePicker
										dateFormat="dd.MM.yyyy."
										selected={this.state.startDate}
										onChange={this.handleDateChangeStart}
										maxDate={new Date()}
									/>
								</Col>
							</Form.Group>
						</Col>
						<Col xs={"auto"}>
							<Form.Group as={Row}>
								<Form.Label column xs={"auto"}>līdz</Form.Label>
								<Col>
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
						<Col>
							<Button 
								className="ml-2 float-right"
								variant="danger"
								onClick={this.clearAllFilters}
							>
								Notīrīt visus filtrus
							</Button>
							<DropdownButton
								variant="secondary"
								title={this.state.dropdown.currentFilter} 
								className="float-right"
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
				<BootstrapTable
					bootstrap4={ true }
					keyField="id" 
					data={ this.state.tableData } 
					columns={ columns } 
					bordered={ false }
					hover={ true }
					defaultSorted={ defaultSorted }
					remote={ { filter: true } }
					onTableChange={ this.onTableChange }
					pagination={ pagination }
					rowStyle={ rowStyle }
				/>
			</ContainerBox>
		);
	}
}

function mapStateToProps(state) {
	return {
		employees: state.employees.employees,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateEmployees: (employees) => dispatch(updateEmployees(employees)),
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

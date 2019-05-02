import { connect } from "react-redux";
import React from "react";

import { Badge, Form, Button, Collapse, Row, Col, Dropdown } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { 
	updateEmployees, 
	showRegisterEmployee,
	showExportExcel,
	showCheckCard,
	showEmployeeWorkLog
} from "../actions/employeeActions";

import { 
	getEmployees,
	getServerEmployeeWorkLogFromTo
} from "../utils/employeeUtils";
import { addZero, millisecondConverter } from "../utils/commonUtils";

import "../styles/main.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "../styles/table.css";

import ContainerBox from "./ContainerBox";
import ViewEmployee from "./ViewEmployee";
import Commands from "./Commands";

import { FiUser, FiMinimize2, FiMaximize2 } from "react-icons/fi";

class Employees extends React.Component {

	constructor() {
		super();

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
			showInactive: true,
			nameFilter: ""
		}
	}

	componentDidMount() {
		getEmployees();

		this.setState({
			updateInterval: (
				setInterval(() => {
					getEmployees();
				}, 1000)
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
			|| prevState.nameFilter !== this.state.nameFilter) {
			this.onTableChange();
		}
	}

	onTableChange = () => {
		this.formatTable(() => {
			this.applyNameFilter();
		});
	}

	applyNameFilter = () => {
		const result = this.state.tableData.filter((row) => {
			return row.name.toString().toLowerCase().indexOf(this.state.nameFilter.toLowerCase()) > -1;
		});

		this.setState({
			tableData: result
		});
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

		const workLogFrom = new Date();
		workLogFrom.setHours(0, 0, 0);

		const workLogTo = new Date();
		workLogTo.setHours(23, 59, 59);

		const promise = employees.map((employee) => {
			return getServerEmployeeWorkLogFromTo(employee.id, workLogFrom, workLogTo).then((res) => {
				return({
					id: employee.id,
					name: {
						id: employee.id,
						name: employee.name,
						surname: employee.surname,
						working: employee.working
					},
					today: {
						time: new Date(),
						lastWorkStart: new Date(employee.last_work_start),
						lastWorkEnd: new Date(employee.last_work_end),
						working: employee.working,
						workLogs: res.data
					},
					commands: employee,
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

	render() {
		const nameFormatter = (cell, row) => {
			return (
				<div>
					<nobr>
						<Badge 
							style={{ fontSize: "14px" }}
							variant={ cell.working ? "success" : "info" }
						>
							<FiUser/>
						</Badge>
						<Button variant="link" onClick={() => this.props.showEmployeeWorkLog(cell.id)}>{cell.name + " " + cell.surname}</Button>
					</nobr>
				</div>
			);
		};

		const todayFormatter = (cell, row) => {
			let badges = [];
			let totalWorkTime = 0;
			let totalWorkTimeFormatted = {
				hours: 0,
				minutes: 0,
				seconds: 0
			};

			cell.workLogs.forEach((workLog, index) => {
				if(workLog.end_time === null) {
					workLog.end_time = new Date();
				}

				totalWorkTime += new Date(workLog.end_time) - new Date(workLog.start_time);
				totalWorkTimeFormatted = millisecondConverter(totalWorkTime);

				const workTimeStartFormatted =
					  addZero(new Date(workLog.start_time).getHours()) + ":" 
					+ addZero(new Date(workLog.start_time).getMinutes());
				
				const workTimeEndFormatted =
					  addZero(new Date(workLog.end_time).getHours()) + ":" 
					+ addZero(new Date(workLog.end_time).getMinutes());
	
				const workTimeFormatted =
					  totalWorkTimeFormatted.hours + " st. " 
					+ totalWorkTimeFormatted.minutes + " min. ";

				badges.push(
					<div key={index}>
						<span 
							style={{ fontSize: "14px" }}
							className="mr-2"
						>
							Ienāca: {workTimeStartFormatted}
						</span>
						{
							cell.working && index === cell.workLogs.length - 1
							? null
							: <span 
								style={{ fontSize: "14px" }}
								className="mr-2"
							>
								Izgāja: {workTimeEndFormatted}
							</span>
						}
						{
							index === cell.workLogs.length - 1
							&& totalWorkTimeFormatted !== null
							? <div 
								style={{ fontSize: "14px" }}
								className="ml-5"
							>
								{workTimeFormatted}
							</div>
							: null
						}
					</div>
				);
			});

			return (badges);
		};

		const commandFormatter = (cell, row) => {
			return (
				<Commands employee={cell}/>
			);
		};

		const columns = [{
			dataField: "id",
			text: "#",
			sort: true,
			classes: "align-middle",
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
			text: "Šodien",
			sort: true,
			sortFunc: (a, b, order) => {
				if (order === "asc") {
					return (a.working 
						? new Date(a.lastWorkStart) 
						: new Date(a.lastWorkEnd)) - (b.working 
							? new Date(b.lastWorkStart) 
							: new Date(b.lastWorkEnd));
				}
				return (b.working 
					? new Date(b.lastWorkStart) 
					: new Date(b.lastWorkEnd)) - (a.working 
						? new Date(a.lastWorkStart) 
						: new Date(a.lastWorkEnd));
			},
			classes: "align-middle",
			formatter: todayFormatter
		}, {
			dataField: "commands",
			text: "",
			classes: "align-middle",
			formatter: commandFormatter
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
			<ContainerBox header={"Darbinieku Saraksts"}>
				<Row>
					<Col>
						<Button 
							variant="link" 
							onClick={this.onToggleFilters}
							className="float-right"
						>
							{
								this.state.showFilters
								? <FiMinimize2 className="mr-2 mb-1"/>
								: <FiMaximize2 className="mr-2 mb-1"/>
							}
							Filtri
						</Button>
						<Dropdown alignRight className="float-right">
							<Dropdown.Toggle variant="link">
								Opcijas
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item onClick={this.props.showRegisterEmployee}>Pievienot jaunu darbinieku</Dropdown.Item>
								<Dropdown.Item onClick={this.props.showExportExcel}>Eksportēt darba laika atskaiti</Dropdown.Item>
								<Dropdown.Item onClick={this.props.showCheckCard}>Pārbaudīt kartes īpašnieku</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</Col>
				</Row>

				<Collapse in={this.state.showFilters} className="w-75">
					<Form className="mt-2">
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
						<Form.Group>
							<Form.Control
								placeholder="Vārds..."
								onChange={this.onChangeNameFilter}
								value={this.state.nameFilter}
							/>
							<Form.Text>
								Meklēt darbinieku pēc vārda
							</Form.Text>
						</Form.Group>
					</Form>
				</Collapse>

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

				<ViewEmployee/>
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
		showRegisterEmployee: () => dispatch(showRegisterEmployee()),
		showExportExcel: () => dispatch(showExportExcel()),
		showCheckCard: () => dispatch(showCheckCard()),
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

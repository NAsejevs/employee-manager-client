import { connect } from "react-redux";
import React from "react";

import { Badge, Form, Button, Collapse, Row, Col } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import download from "downloadjs";

import { 
	updateEmployees, 
	showRegisterEmployee
} from "../actions/employeeActions";

import { getEmployees, exportServerEmployees, getServerEmployeeWorkLogFromTo } from "../utils/employeeUtils";
import { addZero, millisecondConverter } from "../utils/commonUtils";

import "../styles/main.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "../styles/table.css";

import ContainerBox from "./ContainerBox";
import ViewEmployee from "./ViewEmployee";
import Commands from "./Commands";

import { FiUser, FiMinimize2, FiMaximize2, FiUserPlus, FiClipboard } from "react-icons/fi";

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
					name: employee.name + " " + employee.surname,
					personalCode: employee.personalCode,
					status: {
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

	showWorkLog = (userId) => {
		this.setState({
			workLogUserId: userId,
			showWorkLogModal: true,
		});
	}

	handleWorkLogClose = () => {
		this.setState({
			showWorkLogModal: false,
			workLogUserId: null,
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

	exportExcel = () => {
		exportServerEmployees().then((response) => {
			const content = response.headers["content-type"];
           	download(response.data, "Varpas 1.xlsx", content);
		});
	}

	render() {
		const nameFormatter = (cell, row) => {
			return (
				<div>
					<nobr>
						<FiUser/>
						<Button variant="link" onClick={() => this.showWorkLog(row.id)}>{cell}</Button>
					</nobr>
				</div>
			);
		};

		const statusFormatter = (cell, row) => {
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
						<Badge 
							style={{ fontSize: "14px" }}
							variant={ cell.working && index === cell.workLogs.length - 1 ? "success" : "info" }
							className="mr-2"
						>
							Ienāca: {workTimeStartFormatted}
						</Badge>
						{
							cell.working && index === cell.workLogs.length - 1
							? null
							: <Badge 
								style={{ fontSize: "14px" }}
								variant={ "info" }
								className="mr-2"
							>
								Izgāja: {workTimeEndFormatted}
							</Badge>
						}
						<br/>
						{
							index === cell.workLogs.length - 1
							&& totalWorkTimeFormatted !== null
							? <Badge 
								style={{ fontSize: "14px" }}
								variant={ "dark" }
								className="mr-2"
							>
								Kopā nostrādāts: {workTimeFormatted}
							</Badge>
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
			dataField: 'id',
			text: '#',
			sort: true,
			classes: "align-middle",
		}, {
			dataField: 'name',
			text: 'Vārds',
			sort: true,
			classes: "align-middle",
			formatter: nameFormatter,
		}, {
			dataField: 'status',
			text: 'Šodien',
			sort: true,
			classes: "align-middle",
			formatter: statusFormatter
		}, {
			dataField: 'commands',
			text: '',
			classes: "align-middle",
			formatter: commandFormatter
		}];

		const defaultSorted = [{
			dataField: 'id',
			order: 'asc'
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

		const rowStyle = (row, rowIndex) => {
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
					<Col xs={8}>
						<Button
							variant="success"
							onClick={this.props.showRegisterEmployee}
							className="mr-2"
						>
							<FiUserPlus className="mr-2 mb-1"/>
							Pievienot darbinieku
						</Button>
						<Button
							variant="info"
							onClick={this.exportExcel}
						>
							<FiClipboard className="mr-2 mb-1"/>
							Eksportēt Excel
						</Button>
					</Col>
					<Col xs={4}>
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
					keyField='id' 
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

				<ViewEmployee 
					showWorkLogModal={this.state.showWorkLogModal} 
					handleWorkLogClose={this.handleWorkLogClose}
					userId={this.state.workLogUserId}
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
		showRegisterEmployee: () => dispatch(showRegisterEmployee()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

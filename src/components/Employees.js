import { connect } from "react-redux";
import React from "react";
import Cookies from 'universal-cookie';

import { Badge, Button, Row, Col, Dropdown, OverlayTrigger, Popover } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ContainerBox from "./ContainerBox";
import Commands from "./Commands";
import Filters from "./Filters";

import {
	showRegisterEmployee,
	showExportExcel,
	showCheckCard,
	showEmployeeWorkLog
} from "../actions/employeeActions";

import {
	storeUpdateEmployee,
	deleteEmployeeComment,
} from "../utils/employeeUtils";
import { addZero, millisecondConverter, convertSpecialCharacters } from "../utils/commonUtils";

import { FiUser, FiMessageSquare, FiXCircle } from "react-icons/fi";

class Employees extends React.Component {

	constructor() {
		super();

		this.state = {
			workLogUserId: null,
			showWorkLogModal: false,
			tableData: [],
			pageSize: 10,
		}
	}

	componentWillMount() {
		const cookies = new Cookies();
		let settings = cookies.get("settings");

		if(settings) {
			this.setState({
				...settings,
			});
		} else {
			settings = {
				pageSize: 10,
			}

			cookies.set("settings", settings);
		}
	}

	componentDidMount() {
		this.onTableChange();
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.employees !== this.props.employees) {
			this.onTableChange();
		}

		if(prevState.pageSize !== this.state.pageSize) {
			this.saveSettings();
		}
	}

	saveSettings = () => {
		const cookies = new Cookies();
		const settings = {
			...cookies.get("settings"),
			pageSize: this.state.pageSize,
		}

		cookies.set("settings", settings);
	}

	onTableChange = () => {
		this.formatTable((tableData) => {
			this.filterData(tableData);
		});
	}

	onFilterChange = () => {
		this.onTableChange();
	}

	onDataFiltered = (data) => {
		this.setState({
			tableData: data
		});
	}

	formatTable = (callback = () => null) => {
		const workLogFrom = new Date();
		workLogFrom.setHours(0, 0, 0);

		const workLogTo = new Date();
		workLogTo.setHours(23, 59, 59);

		const promise = this.props.employees.map((employee) => {
			const workLogToday = [];
			employee.workLog.forEach((workLog) => {
				if(new Date(workLog.start_time).getTime() >= workLogFrom.getTime() && new Date(workLog.start_time).getTime() <= workLogTo.getTime()) {
					return workLogToday.push(workLog);
				}
			})

			return({
				id: employee.id,
				position: employee.position ? employee.position.toString() : "",
				company: employee.company ? employee.company.toString() : "",
				archived: employee.archived,
				active: employee.active,
				working: employee.working,
				name: {
					id: employee.id,
					name: employee.name,
					surname: employee.surname,
					working: employee.working,
					comments: employee.comments,
				},
				today: {
					working: employee.working,
					workLogs: workLogToday,
				},
				commands: employee,
			});
		});

		Promise.all(promise).then((data) => {
			callback(data);
		});
	}

	render() {
		const nameFormatter = (cell, row) => {
			const commentBorderStyle = {
				borderBottom: "solid 1px gray"
			}

			const comments = cell.comments.length 
			? cell.comments.map((comment, index) => {
				return (
					<Row 
						key={index} 
						style={index < cell.comments.length - 1 ? commentBorderStyle : null} 
						className="ml-1 mr-1 pt-1 pb-2"
					>
						<Col className="align-self-center">
							<span>{comment.text}</span>
						</Col>
						<Col xs="auto">
							<Button
								size={"sm"}
								variant="link"
								onClick={() => deleteEmployeeComment(comment.id).then(() => {
									storeUpdateEmployee(cell.id);
								})}
							>
								<FiXCircle className="mb-1" />
							</Button>
						</Col>
					</Row>
				);
			})
			: null;

			return (
				<div>
					<nobr>
						<Badge 
							style={{ fontSize: "14px" }}
							variant={ cell.working ? "success" : "danger" }
						>
							<FiUser/>
						</Badge>
						<Button 
							variant="link" 
							onClick={() => this.props.showEmployeeWorkLog(cell.id)}
							style={{ color: "#0000FF" }}
						>
							{cell.surname + " " + cell.name}
						</Button>
						{
							cell.comments.length
							? 
							<OverlayTrigger
								trigger="click"
								rootClose
								placement="bottom"
								overlay={
									<Popover>
										{comments}
									</Popover>
								}
							>
								<Button
									size={"sm"}
									variant="link"
								>
									<FiMessageSquare/>
								</Button>
							</OverlayTrigger>
							: 
							null
						}
					</nobr>
				</div>
			);
		};

		const companyFormatter = (cell, row) => {
			return (
				<span className="d-none d-md-inline-block text-truncate" style={{ maxWidth: "14vw" }}>
					{cell}
				</span>
			);
		}

		const todayFormatter = (cell, row) => {
			let badges = [];
			let totalWorkTime = 0;
			let totalWorkTimeConverted = {
				hours: 0,
				minutes: 0,
				seconds: 0
			};

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

				// Each work log entry formatted and applied in HTML format
				badges.push(
					<Row key={index} style={{ fontSize: "14px" }}>
						<Col xs={6}>
							<nobr>
								<span>
									{workTimeStartFormatted}
								</span>
								{
									cell.working && index === cell.workLogs.length - 1
									? null
									: <span>
										&#8594; {workTimeEndFormatted}
									</span>
								}
							</nobr>
						</Col>
						<Col xs={"auto"} className="text-center">
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
			});

			//Total row formatted
			if(badges.length) {
				const totalWorkTimeFormatted =
				totalWorkTimeConverted.hours + " st. " 
				+ totalWorkTimeConverted.minutes + " min. ";

				badges.push(
					<Row key={badges.length} style={{ fontSize: "14px" }}>
						<Col xs={6}>
						</Col>
						<Col xs={"auto"} className="text-center" style={{ borderTop: "solid 1px" }}>
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
			}

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
			classes: "align-middle d-none d-md-table-cell",
			headerClasses: "d-none d-md-table-cell",
			// hidden: true,
		}, {
			dataField: "name",
			text: "Darbinieks",
			sort: true,
			sortFunc: (a, b, order) => {
				if(convertSpecialCharacters(a.surname) < convertSpecialCharacters(b.surname)) {
					return order === "asc" ? -1 : 1;
				} else if(convertSpecialCharacters(a.surname) > convertSpecialCharacters(b.surname)) {
					return order === "asc" ? 1 : -1;
				}
				return 0;
			},
			classes: "align-middle",
			formatter: nameFormatter,
		}, {
			dataField: "company",
			text: "Uzņēmums",
			sort: true,
			classes: "align-middle d-none d-lg-table-cell",
			headerClasses: "d-none d-lg-table-cell",
			formatter: companyFormatter
		}, {
			dataField: "position",
			text: "Amats",
			sort: true,
			classes: "align-middle d-none d-lg-table-cell",
			headerClasses: "d-none d-lg-table-cell",
			formatter: companyFormatter
		}, {
			dataField: "today",
			text: "Šodien",
			sort: true,
			sortFunc: (a, b, order) => {
				if(a.workLogs.length && b.workLogs.length) {
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
				}

				// If there are no work logs for today
				if(!a.workLogs.length) {
					return order === "asc" ? -1 : 1;
				}

				return 0;
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
			dataField: "name",
			order: "asc"
		}];

		const onClickPageSize = (option) => {
			this.setState({
				pageSize: option.page
			});
		}

		const sizePerPageRenderer = ({
			options,
			currSizePerPage,
			onSizePerPageChange
		}) => (
			<Dropdown className="d-inline pr-2">
				<Dropdown.Toggle variant="primary">
					{this.state.pageSize === 9999 ? "Viss" : this.state.pageSize}
				</Dropdown.Toggle>

				<Dropdown.Menu>
					{
						options.map((option, index) => {
							return (
								<Dropdown.Item 
									key={index} 
									onClick={() => {
										onClickPageSize(option);
										onSizePerPageChange(option.page);
									}}
								>
									{option.text}
								</Dropdown.Item>
							);
						})
					}
				</Dropdown.Menu>
			</Dropdown>
		);

		const pagination = paginationFactory({
			page: 1,
			alwaysShowAllBtns: true,
			showTotal: false,
			sizePerPage : this.state.pageSize,
			sizePerPageRenderer,
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
					text: "Viss",
					value: 9999,
				}
			]
		});

		const rowStyle = (row) => {
			if(!row.active) {
				return { backgroundColor: "rgba(255, 0, 0, 0.1)" };
			}

			if(row.archived) {
				return { backgroundColor: "rgba(255, 255, 0, 0.1)" };
			}
		};

		return (
			<ContainerBox header={"Darbinieki"}>
				<Filters 
					onDataFiltered={this.onDataFiltered}
					onFilterChange={this.onFilterChange}
					filterData={filterData => this.filterData = filterData}
				/>
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

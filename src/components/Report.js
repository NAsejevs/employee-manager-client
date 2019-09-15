import { connect } from "react-redux";
import React from "react";
import Cookies from 'universal-cookie';

import { Button, Row, Col, Dropdown } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ContainerBox from "./ContainerBox";
import Filters from "./Filters";

import {
	showEmployeeWorkLog,
	showExportExcel
} from "../actions/employeeActions";

import { addZero, millisecondConverter, convertSpecialCharacters } from "../utils/commonUtils";

import { FiUser } from "react-icons/fi";

class Employees extends React.Component {

	constructor() {
		super();

		const cookies = new Cookies();
		let settings = cookies.get("settings");

		const startDate = new Date();
        startDate.setHours(0,0,0);

        const endDate = new Date();
        endDate.setHours(23,59,59);

		if(settings) {
			settings = {
                ...settings,
				startDate: settings.startDate ? new Date(settings.startDate) : new Date(startDate),
				endDate: settings.endDate ? new Date(settings.endDate) : new Date(endDate),
			};
		} else {
			settings = {
				pageSize: 10,
			}

			cookies.set("settings", settings);
		}

		this.state = {
			workLogUserId: null,
			showWorkLogModal: false,
			tableData: [],
			pageSize: 10,
			...settings,
			dropdown: {
				currentFilter: "Šodiena",
				filters: ["Šodiena", "Vakardiena", "Pēdējās 7 dienas", "Pēdējās 30 dienas"]
			}
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

	onFilterChange = (filters) => {
		this.setState({
			startDate: filters.startDate,
			endDate: filters.endDate,
		}, () => {
			this.onTableChange();
		});
	}

	onDataFiltered = (data) => {
		this.setState({
			tableData: data
		});
	}

	formatTable = (callback = () => null) => {
		const workLogFrom = new Date(this.state.startDate);
		const workLogTo = new Date(this.state.endDate);

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
			return (
				<div>
					<nobr>
						<FiUser/>
						<Button 
							variant="link" 
							onClick={() => this.props.showEmployeeWorkLog(cell.id)}
							style={{ color: "#0000FF" }}
						>
							{cell.surname + " " + cell.name}
						</Button>
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
				}
			});

			//Total row formatted
			if(badges.length && displayOneDay) {
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
			  addZero(new Date(this.state.startDate).getDate()) + "." 
			+ addZero(new Date(this.state.startDate).getMonth() + 1) + "." 
			+ addZero(new Date(this.state.startDate).getFullYear());


		const endDateFormatted =
			  addZero(new Date(this.state.endDate).getDate()) + "." 
			+ addZero(new Date(this.state.endDate).getMonth() + 1) + "." 
			+ addZero(new Date(this.state.endDate).getFullYear());

		const dateRange = startDateFormatted + (startDateFormatted === endDateFormatted ? "" : " - " + endDateFormatted);

		const columns = [{
			dataField: "id",
			text: "#",
			sort: true,
			classes: "align-middle",
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
			text: dateRange,
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
				return 0;
			},
			classes: "align-middle",
			formatter: todayFormatter
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
			if(!row.commands.active) {
				return { backgroundColor: "rgba(255, 0, 0, 0.1)" };
			}

			if(row.commands.archived) {
				return { backgroundColor: "rgba(255, 255, 0, 0.1)" };
			}
		};

		return (
			<ContainerBox header={"Atskaites"}>
				<Filters 
					onDataFiltered={this.onDataFiltered}
					onFilterChange={this.onFilterChange}
					filterData={filterData => this.filterData = filterData}
					dateFilter={true}
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
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id)),
		showExportExcel: () => dispatch(showExportExcel()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

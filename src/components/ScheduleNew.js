import { connect } from "react-redux";
import React from "react";
import ReactTable from "react-table";
import Cookies from "universal-cookie";

import "react-table/react-table.css";

import { Row, Col, Button, Dropdown, InputGroup } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ContainerBox from "./ContainerBox";
import Filters from "./Filters";

import {
	showRegisterEmployee,
	showExportExcel,
	showCheckCard,
	showEmployeeWorkLog
} from "../actions/employeeActions";

import { getSchedules, saveSchedules } from "../utils/employeeUtils";

import { keyboardMap, daysInMonth, convertSpecialCharacters, isWeekend } from "../utils/commonUtils";
import { callbackify } from "util";

class Employees extends React.Component {

	constructor() {
		super();

		this.currentMonth = new Date().getMonth();

		this.transparentColor = "RGBA(0, 0, 0, 0)";
		this.dayColor = "yellow";
		this.nightColor = "blue";
		this.dayOffColor = "gray";
		this.vacationColor = "green";
		this.sickListColor = "cyan";

		this.keyDown = {};

		this.state = {
			// General
			tableData: [],
			pageSize: 10,
			saving: false,
			// Scheduling specific
			schedules: [],
			selectedFields: [],
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
		getSchedules(this.currentMonth).then((res) => {
			const schedules = res.data.map((schedule) => {
				const parsedSchedule = schedule;
				parsedSchedule.days = JSON.parse(parsedSchedule.days);
				return parsedSchedule;
			});

			this.setState({
				schedules: [...schedules],
			});
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.employees !== this.props.employees) {
			this.formatTableData();
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

	saveSchedules = () => {
		this.setState({ saving: true });
		saveSchedules(this.state.schedules).then(() => {
			this.setState({ saving: false });
		});
	}

	formatTableData = () => {
		const tableData = this.props.employees.map((employee) => {
			
			const schedulePromise = new Promise((resolve, reject) => {
				let scheduleIndex = this.state.schedules.findIndex((schedule) => {
					return schedule.employee_id === employee.id;
				});
	
				if(scheduleIndex === -1) {
					// Employee has no previous schedule entries, so let's create a new object for him
					const newDays = new Array(31).fill("", 0, 31);
	
					this.setState({
						schedules: [
							...this.state.schedules,
							{
								employee_id: employee.id,
								month: this.currentMonth,
								days: newDays
							}
						],
					}, () => {
						resolve(this.state.schedules.length - 1);
					});
				} else {
					resolve(scheduleIndex);
				}
			});

			return schedulePromise.then((index) => {
				return ({
					name: employee.surname + " " + employee.name,
					schedule: this.state.schedules[index],
					scheduleIndex: index,
				});
			})
		});

		Promise.all(tableData).then((data) => {
			this.setState({
				tableData: data,
			});
		});
	}

	scheduleCellRenderer = (props) => {
		const dayIndex = parseInt(props.column.Header) - 1;
		const scheduleIndex = props.original.scheduleIndex;

		const onChange = (e) => {
			let newSchedules = [...this.state.schedules];
			newSchedules[scheduleIndex].days[dayIndex] = e.target.value;

			this.setState({
				schedules: newSchedules,
			}, () => console.log(this.state.schedules));
		}

		return (
			<input
				onChange={(e) => onChange(e)}
				value={props.value.days[dayIndex]}
				className="w-100 h-100"
				style={{ border: 0, background: 0 }}
			/>
		)
	}

	render() {
		const columns = [{
			Header: "Vārds",
			accessor: "name"
		}];

		const days = daysInMonth(new Date().getMonth(), new Date().getFullYear());

		for(let i = 0; i < days; i++) {
			columns.push({
				Header: (i + 1).toString(),
				accessor: "schedule",
				Cell: this.scheduleCellRenderer,
				width: 32,
				getProps: (state, rowInfo, column) => {
					return {
						style: {
							padding: 0,
						},
					};
				},
			});
		}

		return (
			<ContainerBox header={"Grafiks"}>
				<Filters 
					onDataFiltered={this.onDataFiltered}
					onFilterChange={this.onFilterChange}
					filterData={filterData => this.filterData = filterData}
				/>
				<Row className="mt-3 text-center">
					<Col>
						<span className="dot align-bottom" style={{ backgroundColor: this.dayColor }}/>
						<span className="ml-2">Diena</span>
					</Col>
					<Col>
						<span className="dot align-bottom" style={{ backgroundColor: this.nightColor }}/>
						<span className="ml-2">Nakts</span>
					</Col>
					<Col>
						<span className="dot align-bottom" style={{ backgroundColor: this.dayOffColor }}/>
						<span className="ml-2">Brīvdiena</span>
					</Col>
					<Col>
						<span className="dot align-bottom" style={{ backgroundColor: this.vacationColor }}/>
						<span className="ml-2">Atvaļinājums</span>
					</Col>
					<Col>
						<span className="dot align-bottom" style={{ backgroundColor: this.sickListColor }}/>
						<span className="ml-2">Slimības lapa</span>
					</Col>
				</Row>
				<Row className="mb-3 mt-3">
					<Col>
						<Button  
							onClick={this.saveSchedules}
							className="float-right"
						>
							{
								this.state.saving 
								? "Saglabā..."
								: "Saglabāt"
							}
						</Button>
					</Col>
				</Row>
				<ReactTable
					data={ this.state.tableData } 
					columns={ columns } 
					getTrProps={(state, rowInfo, instance) => {
						return {
							style: {
								height: "32px",
							},
						};
					}}
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

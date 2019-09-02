import { connect } from "react-redux";
import React from "react";
import ReactTable from "react-table";
import Cookies from "universal-cookie";

import "react-table/react-table.css";

import { Row, Col, Button } from "react-bootstrap";

import ContainerBox from "./ContainerBox";
import Filters from "./Filters";
import Cell from "./Cell";

import {
	showRegisterEmployee,
	showExportExcel,
	showCheckCard,
	showEmployeeWorkLog,
} from "../actions/employeeActions";

import { getSchedules, saveSchedules } from "../utils/employeeUtils";

import { daysInMonth, getDifference } from "../utils/commonUtils";

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

		const cookies = new Cookies();
		let settings = cookies.get("settings");

		if(!settings) {
			settings = {
				pageSize: 10,
			}

			cookies.set("settings", settings);
		}

		this.state = {
			// General
			tableData: [],
			pageSize: 10,
			...settings,
			saving: false,
			// Scheduling specific
			schedules: [],
			selectedFields: [],
			target: null,
			targetValue: null,
		}
	}

	componentDidMount() {
		getSchedules(this.currentMonth).then((res) => {
			console.log(res);
			const schedules = res.data.map((schedule) => {
				const parsedSchedule = schedule;
				parsedSchedule.days = JSON.parse(parsedSchedule.days);
				return parsedSchedule;
			});

			this.setState({
				schedules: [...schedules],
			}, () => this.formatTableData());
		});

		window.addEventListener("keydown", (event) => {
		this.keyDown[event.keyCode] = true;
		});

		window.addEventListener("keyup", (event) => {
			this.keyDown[event.keyCode] = false;
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

	isKeyDown = (key) => {
		return this.keyDown[key];
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
		console.log("formating table");
		const tableData = this.props.employees.map((employee) => {
			let schedule = {};
			if(employee.schedules.length === 0) {
				const newDays = new Array(31).fill("", 0, 31);
	
				schedule = {
					employee_id: employee.id,
					month: this.currentMonth,
					days: newDays
				}
			}

			return {
				employee: employee,
				name: employee.surname + " " + employee.name,
				schedule: schedule,
				selectedFields: this.state.selectedFields,
			};
		});

		Promise.all(tableData).then((data) => {
			this.setState({
				tableData: [...data],
			});
		});
	}

	onCellChange = (e, props, dayIndex) => {
		const employeeId = props.original.employee.id;
		let newTableData = [...this.state.tableData];
		const employeeIndex = newTableData.findIndex((employee) => {
			return employee.employee.id === employeeId;
		});

		newTableData[employeeIndex].schedule.days[dayIndex] = e.target.value;

		this.setState({
			tableData: newTableData
		}, () => {
			console.log(this.state.tableData);
		});
	}

	scheduleCellRenderer = (props) => {
		const newProps = {...props}
		const dayIndex = parseInt(props.column.Header) - 1;
		return <Cell 
			key={[props.original.name, dayIndex]} 
			dayIndex={dayIndex} 
			onCellChange={this.onCellChange} 
			{...newProps}
		/>
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
				<Row className="mb-3">
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
				<Row className="mb-3 text-center" style={{ fontSize: "14px" }}>
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
					style={{
						fontSize: "12px",
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
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id)),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

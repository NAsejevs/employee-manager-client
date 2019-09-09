import { connect } from "react-redux";
import React from "react";
import ReactTable from "react-table";
import Cookies from "universal-cookie";
import cloneDeep from 'lodash/cloneDeep';

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

import { daysInMonth } from "../utils/commonUtils";
import Table from "./table/Table";
import InputCell from "./table/InputCell";

class CustomSchedule extends React.Component {

	constructor() {
		super();

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
			// Scheduling specific
			saving: false,
			schedules: [],
		}

		this.currentMonth = new Date().getMonth();
		this.columns = [{
			header: "Vārds",
			accessor: "name",
		}];

		for(let i = 0; i < daysInMonth(new Date().getMonth(), new Date().getFullYear()); i++) {
			this.columns.push({
				header: (i + 1).toString(),
				accessor: "days",
				cellRenderer: (props) => this.cellRenderer(props)
			});
		}
	}

	cellRenderer = (props) => {
		const onChange = (e) => {
			const newSchedules = cloneDeep(this.state.schedules);
			newSchedules[props.original.scheduleIndex].days[props.colId] = e.target.value;

			this.setState({
				schedules: newSchedules,
			});
		}

		return <InputCell {...props} onChange={onChange}/>;
	}

	componentDidMount() {
		getSchedules(this.currentMonth).then((res) => {
			const schedules = res.data.map((schedule) => {
				return {
					...schedule,
					days: JSON.parse(schedule.days)
				}
			});

			this.setState({
				schedules: schedules,
			});
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if(JSON.stringify(prevProps.employees) !== JSON.stringify(this.props.employees) ||
			JSON.stringify(prevState.schedules) !== JSON.stringify(this.state.schedules)) {
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
		console.log("saving..");
		this.setState({ saving: true });
		saveSchedules(this.state.schedules).then(() => {
			this.setState({ saving: false });
		});
	}

	formatTableData = () => {
		console.log("formatting table");
		let newSchedules = [...this.state.schedules];

		const tableData = this.props.employees.map((employee) => {
			let scheduleIndex = this.state.schedules.findIndex((schedule) => {
				return schedule.employee_id === employee.id;
			});

			if(scheduleIndex === -1) {
				const newDays = new Array(31).fill("", 0, 31);

				newSchedules.push({
					employee_id: employee.id,
					month: this.currentMonth,
					days: newDays
				});

				scheduleIndex = newSchedules.length - 1; 
			}

			return {
				id: employee.id,
				name: employee.surname + " " + employee.name,
				days: newSchedules[scheduleIndex].days,
				scheduleIndex,
			}
		});

		Promise.all(tableData).then((data) => {
			this.setState({
				tableData: data,
				schedules: newSchedules,
			});
		});
	}

	render() {
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
				<Table
					columns={this.columns}
					data={this.state.tableData}
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
)(CustomSchedule);

import { connect } from "react-redux";
import React from "react";
import Cookies from 'universal-cookie';
import cloneDeep from 'lodash/cloneDeep';

import { Row, Col, Button, Dropdown } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ContainerBox from "./ContainerBox";
import Filters from "./Filters";
import ScheduleCell from "./ScheduleCell";

import {
	showRegisterEmployee,
	showExportExcel,
	showCheckCard,
	showEmployeeWorkLog
} from "../actions/employeeActions";

import { getSchedules, saveSchedules } from "../utils/employeeUtils";

import { daysInMonth, convertSpecialCharacters, isWeekend } from "../utils/commonUtils";

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
		}
	}

	componentDidMount() {
		this.onTableChange();

		getSchedules(this.currentMonth).then((res) => {
			const schedules = res.data.map((schedule) => {
				const parsedSchedule = schedule;
				parsedSchedule.days = JSON.parse(parsedSchedule.days);
				return parsedSchedule;
			});

			this.setState({
				schedules: cloneDeep(schedules),
			});
		});

		// window.addEventListener("keydown", (event) => {
		// 	this.keyDown[event.keyCode] = true;

		// 	if(this.state.selectedFields.length > 0 &&
		// 		(keyboardMap[event.keyCode] === "D" ||
		// 		keyboardMap[event.keyCode] === "N" ||
		// 		keyboardMap[event.keyCode] === "B" ||
		// 		keyboardMap[event.keyCode] === "A" ||
		// 		keyboardMap[event.keyCode] === "S")) {

		// 		let newSchedules = [...this.state.schedules];

		// 		this.state.selectedFields.forEach((field) => {
		// 			newSchedules[field[0]].days[field[2]] = keyboardMap[event.keyCode];
		// 		});

		// 		this.setState({
		// 			schedules: newSchedules,
		// 		});
		// 	}
		// });

		// window.addEventListener("keyup", (event) => {
		// 	this.keyDown[event.keyCode] = false;
		// });
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.schedules !== this.state.schedules) {
			console.log("schedules changed!");
		}

		if(prevProps.employees !== this.props.employees) {
			this.onTableChange();
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

	saveSchedules = () => {
		this.setState({ saving: true });
		saveSchedules(this.state.schedules).then(() => {
			this.setState({ saving: false });
		});
	}

	onClickScheduleInput = (event, cell, row, rowIndex, colIndex, selectedFields, schedules, scheduleIndex) => {
		if(!this.isKeyDown(17) && !this.isKeyDown(16)) { // CTRL is not being held
			selectedFields = [];
		}

		if(this.isKeyDown(16)) { // SHIFT is being held down
			const start = selectedFields[selectedFields.length - 1];
			const end = [scheduleIndex, rowIndex, colIndex];

			for(let i = Math.min(start[1], end[1]); i <= Math.max(start[1], end[1]); i++) {
				for(let i2 = Math.min(start[2], end[2]); i2 <= Math.max(start[2], end[2]); i2++) {
					selectedFields.push([scheduleIndex, i, i2]);
				}
			}
		}
		
		selectedFields.push([scheduleIndex, rowIndex, colIndex]);

		this.setState({
			selectedFields: selectedFields,
		});
	}

	onChangeScheduleInput = (event, cell, row, rowIndex, colIndex, selectedFields, schedules, scheduleIndex) => {
		let newSchedules = cloneDeep(this.state.schedules);
		newSchedules[scheduleIndex].days[colIndex] = event.target.value;

		this.setState({
			schedules: newSchedules,
		});
	}

	formatTable = (callback = () => null) => {
		const newSchedules = [...this.state.schedules];
		const promise = this.props.employees.map((employee) => {

			let scheduleIndex = newSchedules.findIndex((schedule) => {
				return schedule.employee_id === employee.id;
			});

			if(scheduleIndex === -1) {
				// Employee has no previous schedule entries, so let's create a new object for him
				const newDays = new Array(31).fill("", 0, 31);
	
				newSchedules.push({
					employee_id: employee.id,
					month: this.currentMonth,
					days: newDays
				});
			}

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
					surname: employee.surname
				},
			});
		});

		Promise.all(promise).then((data) => {
			callback(data);

			this.setState({
				schedules: newSchedules,
			});
		});
	}

	render() {
		const nameFormatter = (cell, row) => {
			return (
				<Button 
					variant="link" 
					onClick={() => this.props.showEmployeeWorkLog(cell.id)}
					style={{ color: "#0000FF", fontSize: "12px" }}
					className="m-0 p-0"
				>
					{cell.surname + " " + cell.name}
				</Button>
			);
		};

		const dayFormatter = (cell, row, rowIndex, extraData) => {
			const props = {
				cell, 
				row, 
				rowIndex, 
				extraData
			}
			return <ScheduleCell 
				onClickScheduleInput={this.onClickScheduleInput}
				onChangeScheduleInput={this.onChangeScheduleInput}
				{...props}
			/>
		};

		const columns = [{
			dataField: "id",
			text: "#",
			sort: true,
			classes: "align-middle d-none d-md-table-cell",
			headerClasses: "d-none d-md-table-cell",
			hidden: true,
		}, {
			dataField: "name",
			text: "Vārds",
			sort: true,
			sortFunc: (a, b, order) => {
				if(convertSpecialCharacters(a.surname) < convertSpecialCharacters(b.surname)) {
					return order === "asc" ? -1 : 1;
				} else if(convertSpecialCharacters(a.surname) > convertSpecialCharacters(b.surname)) {
					return order === "asc" ? 1 : -1;
				}
				return 0;
			},
			classes: "text-center p-0 m-0",
			formatter: nameFormatter,
		}];

		const days = daysInMonth(new Date().getMonth(), new Date().getFullYear());

		for(let i = 0; i < days; i++) {
			const date = new Date();
			date.setMonth(this.currentMonth);
			date.setDate(i);

			let color = "RGBA(0, 0, 0, 0)";
			if(isWeekend(date)) {
				color = "lime";
			}

			columns.push({
				dataField: "scheduleDay" + i,
				text: (i + 1).toString(),
				formatter: dayFormatter,
				formatExtraData: { 
					colIndex: i, 
					selectedFields: this.state.selectedFields,
					schedules: this.state.schedules,
					counter: this.state.counter,
				},
				headerClasses: "text-center",
				headerStyle: { backgroundColor: color },
				classes: "text-center p-0 m-0",
				style: { backgroundColor: color }
			});
		}

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
				<BootstrapTable 
					bootstrap4={ true }
					keyField="id"
					data={ this.state.tableData } 
					columns={ columns } 
					bordered={ true }
					condensed={ true }
					hover={ true }
					defaultSorted={ defaultSorted }
					remote={ { filter: true } }
					onTableChange={ this.onTableChange }
					pagination={ pagination }
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

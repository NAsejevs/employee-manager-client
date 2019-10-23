import { connect } from "react-redux";
import React from "react";
import Cookies from "universal-cookie";

import { Row, Col, Button, Dropdown, Form } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import ContainerBox from "./ContainerBox";
import Filters from "./Filters";
import ScheduleCell from "./ScheduleCell";
import BoostrapDatePicker from "./BoostrapDatePicker";

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

		this.transparentColor = "RGBA(0, 0, 0, 0)";
		this.dayColor = "#ffcc00";
		this.nightColor = "#005f9d";
		this.dayOffColor = "#ff99cc";
		this.vacationColor = "#00ff00";
		this.sickListColor = "#2fc2b5";
		this.weekendColor = "#ffcc99";
		this.lateColor = "red";

		this.keyDown = {};

		this.cellRefs = [];

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
			uncheckedEmployees: [],
			schedules: [],
			selectedFields: [],
			scheduleDate: new Date(),
		}

		this.columns = [{
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
			formatter: this.nameFormatter,
		}];

		const days = daysInMonth(new Date().getMonth(), new Date().getFullYear());

		for(let i = 0; i < days; i++) {
			const date = new Date(this.state.scheduleDate);
			date.setDate(i);

			let color = "RGBA(0, 0, 0, 0)";
			if(isWeekend(date)) {
				color = this.weekendColor;
			}

			this.columns.push({
				dataField: "day" + i,
				text: (i + 1).toString(),
				formatter: this.dayFormatter,
				formatExtraData: { 
					colIndex: i,
				},
				headerClasses: "text-center",
				headerStyle: { backgroundColor: color },
				classes: "text-center p-0 m-0",
				style: { backgroundColor: color }
			});
		}

		this.defaultSorted = [{
			dataField: "name",
			order: "asc"
		}];

		this.pagination = paginationFactory({
			page: 1,
			alwaysShowAllBtns: true,
			showTotal: false,
			sizePerPage : this.state.pageSize,
			sizePerPageRenderer: this.sizePerPageRenderer,
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
	}

	componentDidMount() {
		this.fetchSchedules();

		window.addEventListener("keydown", (event) => {
			this.keyDown[event.keyCode] = true;
		});

		window.addEventListener("keyup", (event) => {
			this.keyDown[event.keyCode] = false;
		});
	}

	fetchSchedules = () => {
		getSchedules(this.state.scheduleDate.getMonth()).then((res) => {
			const newSchedules = this.props.employees.map((employee) => {
				let days = [];
				const schedule = res.data.find((schedule) => {
					return schedule.employee_id === employee.id
				});

				if(schedule === undefined) {
					days = new Array(31).fill(" ", 0, 31);
				} else {
					days = JSON.parse(schedule.days);
				}

				return {
					employee_id: employee.id,
					month: this.state.scheduleDate.getMonth(),
					days: days
				};
			});
	
			Promise.all(newSchedules).then((data) => {
				this.setState({
					schedules: JSON.parse(JSON.stringify(data)),
					selectedFields: [],
				}, () => this.onTableChange());
			});
		});
	}

	checkEmptySchedules = () => {
		const newSchedules = this.props.employees.map((employee) => {
			let days = [];
			const schedule = this.state.schedules.find((schedule) => {
				return schedule.employee_id === employee.id
			});

			if(schedule === undefined) {
				days = new Array(31).fill(" ", 0, 31);
			} else {
				days = schedule.days;
			}

			return {
				employee_id: employee.id,
				month: this.state.scheduleDate.getMonth(),
				days: days
			};
		});

		Promise.all(newSchedules).then((data) => {
			this.setState({
				schedules: JSON.parse(JSON.stringify(data)),
			}, () => {
				this.onTableChange();
			});
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.employees.length === 0 && this.props.employees.length !== 0) {
			this.fetchSchedules();
		}

		if(JSON.stringify(prevProps.employees) !== JSON.stringify(this.props.employees) &&
			this.props.employees.length > 0) {
			this.checkEmptySchedules();
		}

		if(JSON.stringify(prevProps.employees) !== JSON.stringify(this.props.employees) ||
			JSON.stringify(prevState.schedules) !== JSON.stringify(this.state.schedules) ||
			JSON.stringify(prevState.selectedFields) !== JSON.stringify(this.state.selectedFields) ||
			JSON.stringify(prevState.uncheckedEmployees) !== JSON.stringify(this.state.uncheckedEmployees)) {
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

	onChangeScheduleDate = (date) => {
		this.setState({
			scheduleDate: new Date(date),
		}, () => {
			this.columns = this.columns.map((column, index) => {
				if(!column.dataField.includes("day")) {
					return column;
				}
	
				const date = new Date(this.state.scheduleDate);
				date.setDate(parseInt(column.text));
				console.log(date);
	
				let color = "RGBA(0, 0, 0, 0)";
				if(isWeekend(date)) {
					console.log("is weekend!")
					color = this.weekendColor;
				}
	
				return {
					...column,
					headerStyle: { backgroundColor: color },
					style: { backgroundColor: color },
				}
			});

			this.fetchSchedules();
		});
	}

	onClickScheduleInput = (event, scheduleIndex, rowIndex, colIndex) => {
		event.target.select();
	}

	onFocusScheduleInput = (event, scheduleIndex, rowIndex, colIndex) => {
		event.target.select();
		let selectedFields = JSON.parse(JSON.stringify(this.state.selectedFields));

		if(!this.isKeyDown(17) && !this.isKeyDown(16)) { // CTRL and SHIFT is not being held
			selectedFields = [];
		}

		if(this.isKeyDown(16)) { // SHIFT is being held down
			const start = selectedFields[selectedFields.length - 1];
			if(start !== undefined) {
				const end = [scheduleIndex, rowIndex, colIndex];

				for(let i = Math.min(start[1], end[1]); i <= Math.max(start[1], end[1]); i++) {
					for(let i2 = Math.min(start[2], end[2]); i2 <= Math.max(start[2], end[2]); i2++) {
						selectedFields.push([-1, i, i2]);
					}
				}
			}
		}

		selectedFields.push([scheduleIndex, rowIndex, colIndex]);

		this.setState({
			selectedFields: selectedFields,
		});
	}

	onChangeScheduleInput = (event, scheduleIndex, rowIndex, colIndex) => {
		let newSchedules = JSON.parse(JSON.stringify(this.state.schedules));

		const value = event.target.value.toUpperCase();

		if(newSchedules[scheduleIndex].days[colIndex] !== value) {
			newSchedules[scheduleIndex].days[colIndex] = value.replace(newSchedules[scheduleIndex].days[colIndex], "");

			if(newSchedules[scheduleIndex].days[colIndex] === "") {
				newSchedules[scheduleIndex].days[colIndex] = " ";
			}
		}
		if(this.state.selectedFields.length > 1) {
			this.state.selectedFields.forEach((selectedField) => {
				newSchedules[this.cellRefs[selectedField[1]][selectedField[2]].props.row.scheduleIndex].days[selectedField[2]] = newSchedules[scheduleIndex].days[colIndex];
			});
		}

		this.setState({
			schedules: newSchedules,
		});
	}

	onEmployeeCheck = (id) => {
		const uncheckedEmployees = [...this.state.uncheckedEmployees];
		const employeeIndex = uncheckedEmployees.indexOf(id);
		
		if(employeeIndex === -1) {
			uncheckedEmployees.push(id);
		} else {
			uncheckedEmployees.splice(employeeIndex, 1);
		}

		this.setState({
			uncheckedEmployees: uncheckedEmployees
		}, () => {
			console.log(this.state.uncheckedEmployees);
		});
	}

	createEmptySchedule = () => {
		const selectedFields = [];

		const newSchedules = this.props.employees.map((employee) => {
			const newDays = new Array(31).fill(" ", 0, 31);

			return {
				employee_id: employee.id,
				month: this.state.scheduleDate.getMonth(),
				days: newDays
			};
		});

		Promise.all(newSchedules).then(() => {
			this.setState({
				schedules: newSchedules,
				selectedFields: selectedFields,
			});
		});
	}

	formatTable = (callback = () => null) => {
		this.cellRefs = [];
		const promise = this.props.employees.map((employee, index) => {
			return({
				id: employee.id,
				name: {
					id: employee.id,
					name: employee.name,
					surname: employee.surname,
					checked: !this.state.uncheckedEmployees.includes(employee.id),
				},
				position: employee.position ? employee.position.toString() : "",
				company: employee.company ? employee.company.toString() : "",
				archived: employee.archived,
				active: employee.active,
				working: employee.working,
				schedule: this.state.schedules[index],
				scheduleIndex: index,
				selectedFields: this.state.selectedFields,
			});
		});

		Promise.all(promise).then((data) => {
			callback(data);
		});
	}

	nameFormatter = (cell, row) => {
		return (
			<nobr>
				<Form.Check 
					type="checkbox"
					checked={cell.checked}
					onChange={() => this.onEmployeeCheck(cell.id)}
					className="mr-1 d-inline"
				/>
				<Button 
					variant="link" 
					onClick={() => this.props.showEmployeeWorkLog(cell.id)}
					style={{ color: "#0000FF", fontSize: "12px" }}
					className="m-0 p-0 align-text-top"
				>
					{cell.surname + " " + cell.name}
				</Button>
			</nobr>
		);
	};

	dayFormatter = (cell, row, rowIndex, extraData) => {
		if(row.schedule === undefined ||
			row === undefined) {
			return null;
		}

		const props = {
			cell, 
			row, 
			rowIndex, 
			extraData
		}
		return <ScheduleCell
			key={[row.id, rowIndex]}
			onClickScheduleInput={this.onClickScheduleInput}
			onFocusScheduleInput={this.onFocusScheduleInput}
			onChangeScheduleInput={this.onChangeScheduleInput}
			ref={(ref) => {
				if(this.cellRefs[rowIndex] === undefined) {
					this.cellRefs[rowIndex] = new Array(31);
				}
				this.cellRefs[rowIndex][extraData.colIndex] = ref;
				return true;
			}}
			{...props}
		/>
	};

	sizePerPageRenderer = ({
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
									this.onClickPageSize(option);
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

	onClickPageSize = (option) => {
		this.setState({
			pageSize: option.page
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
				<Row className="mt-3 text-center" style={{ fontSize: "14px" }}>
					<Col>
						<span className="dot align-middle" style={{ backgroundColor: this.dayColor }}/>
						<span className="ml-2">(D) Diena</span>
					</Col>
					<Col>
						<span className="dot align-middle" style={{ backgroundColor: this.nightColor }}/>
						<span className="ml-2">(N) Nakts</span>
					</Col>
					<Col>
						<span className="dot align-middle" style={{ backgroundColor: this.dayOffColor }}/>
						<span className="ml-2">(B) Brīvdiena</span>
					</Col>
					<Col>
						<span className="dot align-middle" style={{ backgroundColor: this.vacationColor }}/>
						<span className="ml-2">(A) Atvaļinājums</span>
					</Col>
					<Col>
						<span className="dot align-middle" style={{ backgroundColor: this.sickListColor }}/>
						<span className="ml-2">(S) Slimības lapa</span>
					</Col>
					<Col>
						<span className="dot align-middle" style={{ backgroundColor: this.lateColor }}/>
						<span className="ml-2">(K) Darba kavējums</span>
					</Col>
				</Row>
				<Row className="mb-3 mt-3">
					<Col>
						<ul style={{ fontSize: "12px" }}>
							<li>
								CTRL + KLIKŠĶIS - Iezīmē vairākus individuālus lauciņus
							</li>
							<li>
								SHIFT + KLIKŠĶIS - Iezīmē vairākus no-līdz lauciņus
							</li>
						</ul>
					</Col>
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
						<BoostrapDatePicker
							dateFormat="MM.yyyy."
							selected={this.state.scheduleDate}
							onChange={this.onChangeScheduleDate}
							showMonthYearPicker
							className="float-right mr-2 text-center"
						/>
					</Col>
				</Row>
				<BootstrapTable 
					bootstrap4={ true }
					keyField="id"
					data={ this.state.tableData } 
					columns={ this.columns } 
					bordered={ true }
					condensed={ true }
					hover={ true }
					defaultSorted={ this.defaultSorted }
					remote={ { filter: true } }
					pagination={ this.pagination }
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

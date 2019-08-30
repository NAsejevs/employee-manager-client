import { connect } from "react-redux";
import React from "react";
import ReactTable from "react-table";
import Cookies from "universal-cookie";

import "react-table/react-table.css";

import { Row, Col, Button } from "react-bootstrap";

import ContainerBox from "./ContainerBox";
import Filters from "./Filters";

import {
	showRegisterEmployee,
	showExportExcel,
	showCheckCard,
	showEmployeeWorkLog
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
					schedules: this.state.schedules[index],
					scheduleIndex: index,
					selectedFields: this.state.selectedFields,
				});
			})
		});

		Promise.all(tableData).then((data) => {
			this.setState({
				tableData: [...data],
			});
		});
	}

	scheduleCellRenderer = (props) => {
		const dayIndex = parseInt(props.column.Header) - 1;
		const scheduleIndex = props.original.scheduleIndex;
		let selectedFields = [...this.state.selectedFields];

		const onClick = (e) => {
			if(!this.isKeyDown(17) && !this.isKeyDown(16)) { // CTRL is not being held
				selectedFields = [];
			}
	
			if(this.isKeyDown(16)) { // SHIFT is being held down
				const start = selectedFields[selectedFields.length - 1];
				const end = [scheduleIndex, props.index, dayIndex];

				console.log("start: ", start);
				console.log("end: ", end);
	
				for(let i = Math.min(start[1], end[1]); i <= Math.max(start[1], end[1]); i++) {
					for(let i2 = Math.min(start[2], end[2]); i2 <= Math.max(start[2], end[2]); i2++) {
							selectedFields.push([i, i, i2]);
					}
				}
			}

			selectedFields.push([scheduleIndex, props.index, dayIndex]);
	
			this.setState({
				selectedFields: selectedFields,
			}, () => this.formatTableData());
		}

		const onFocus = (e) => {
			e.target.select();
		}

		const onBlur = (e) => {
			
		}

		const onChange = (e) => {
			let newSchedules = [...this.state.schedules];
			let newValue = getDifference(newSchedules[scheduleIndex].days[dayIndex], e.target.value.toUpperCase());
			
			if(newValue === "") {
				newValue = newSchedules[scheduleIndex].days[dayIndex];
			}
			
			newSchedules[scheduleIndex].days[dayIndex] = newValue;

			if(this.state.selectedFields.length > 1) {
				this.state.selectedFields.forEach((field) => {
					newSchedules[field[0]].days[field[2]] = newValue;
				});
			}

			this.setState(() => {
				return {
					schedules: newSchedules
				};
			});
		}

		let color = this.transparentColor;

		switch(this.state.schedules[scheduleIndex].days[dayIndex]) {
			case "d":
			case "D": {
				color = this.dayColor;
				break;
			}
			case "n":
			case "N": {
				color = this.nightColor;
				break;
			}
			case "b":
			case "B": {
				color = this.dayOffColor;
				break;
			}
			case "a":
			case "A": {
				color = this.vacationColor;
				break;
			}
			case "s":
			case "S": {
				color = this.sickListColor;
				break;
			}
			default: {
				color = this.transparentColor;
				break;
			}
		}

		for(let i = 0; i < this.state.selectedFields.length; i++) {
			if(this.state.selectedFields[i][0] === scheduleIndex &&
				this.state.selectedFields[i][2] === dayIndex) {
				color = "RGBA(1, 1, 1, 0.3)";
			}
		}

		return (
			<input
				key={[scheduleIndex, dayIndex]}
				onClick={(e) => onClick(e)}
				onFocus={(e) => onFocus(e)}
				onChange={(e) => onChange(e)}
				onBlur={(e) => onBlur(e)}
				value={props.value.days[dayIndex]}
				className="w-100 h-100 text-center"
				style={{ border: 0, background: color }}
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
				accessor: "schedules",
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
		showEmployeeWorkLog: (id) => dispatch(showEmployeeWorkLog(id))
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

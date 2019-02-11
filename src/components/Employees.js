import { connect } from "react-redux";
import React from "react";

import { Badge, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import { LinkContainer } from "react-router-bootstrap";

import { updateDisplayEmployees } from "../actions/employeeActions";

import { addZero, getServerEmployees, setServerEmployeeWorking } from "../utils/utils";

import cancel from "../images/cancel.png";
import checkmark from "../images/checkmark.png";
import user from "../images/user.png";

import "../styles/main.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ContainerBox from "./ContainerBox";

class Employees extends React.Component {

	constructor() {
		super();

		this.state = {
			updateInterval: null,
		}
	}

	componentDidMount() {
		getServerEmployees().then((res) => {
			this.props.updateDisplayEmployees(res.data);
		});
		
		const updateInterval = setInterval(() => {
			getServerEmployees().then((res) => {
				this.props.updateDisplayEmployees(res.data);
			});
		}, 5000);

		this.setState({ updateInterval: updateInterval });
	}

	componentWillUnmount() {
		clearInterval(this.state.updateInterval);
	}

	setEmployeeWorking = (id, working) => {
		setServerEmployeeWorking(id, working).then(() => {
			getServerEmployees().then((res) => {
				this.props.updateDisplayEmployees(res.data);
			});
		});
	}

	render() {
		const nameFormatter = (cell, row) => {
			return (
				<div>
					<Image src={user} width="20" height="20" className="mr-2"/>
					<LinkContainer to={`/employee/${row.employee.id}`}>
						<a href="#employee">{cell}</a>
					</LinkContainer>
				</div>
			);
		};

		const statusFormatter = (cell, row) => {
			return (
				<Badge 
					style={{ fontSize: "14px" }}
					variant={row.employee.working 
						? "success" 
						: "info"}
				>
					{cell}
				</Badge>
			);
		};

		const columns = [{
			dataField: 'id',
			text: '#',
			sort: true
		}, {
			dataField: 'name',
			text: 'Vārds',
			sort: true,
			formatter: nameFormatter,
			filter: textFilter()
		}, {
			dataField: 'personalCode',
			text: 'Personas Kods',
			sort: true,
			filter: textFilter()
		}, {
			dataField: 'status',
			text: 'Status',
			sort: true,
			formatter: statusFormatter
		}, {
			dataField: 'commands',
			text: 'Komandas'
		}];

		const defaultSorted = [{
			dataField: 'id',
			order: 'asc'
		}];

		let employees = [{
			employee: "1",
			id: "1",
			name: ("1" + " " + "1"),
			personalCode: "1",
			status: "1",
			commands: "1"
		}];

		employees = this.props.employees.map((employee) => {
			let lastWorkTimePure = employee.working 
				? new Date(employee.last_work_start) 
				: new Date(employee.last_work_end) 

			const lastWorkTime =
				+ addZero(lastWorkTimePure.getHours()) + ":" 
				+ addZero(lastWorkTimePure.getMinutes());


			const lastWork = employee.working 
				? "IENĀCA: " + lastWorkTime
				: "IZGĀJA: " + lastWorkTime

			return({
				employee: employee,
				id: employee.id,
				name: (employee.name + " " + employee.surname),
				personalCode: employee.personalCode,
				status: lastWork,
				commands:
					<OverlayTrigger
						placement={"top"}
						overlay={
							<Tooltip id={`tooltip-top`}>
								Atzīmēt kā {employee.working ? "izgājušu" : "ienākušu"}
							</Tooltip>
						}
					>
						<span
							className="mr-2"
							onClick={() => this.setEmployeeWorking(employee.id, !employee.working)}
						>
							{
								employee.working 
								? <Image src={cancel} width="24" height="24"/>
								: <Image src={checkmark} width="24" height="24"/>
							}
						</span>
					</OverlayTrigger>
			});
		});

		return (
			<ContainerBox header={"Darbinieku Saraksts"}>
				<BootstrapTable 
					bootstrap4={ true }
					keyField='id' 
					data={ employees } 
					columns={ columns } 
					bordered={ false }
					hover={ true }
					filter={ filterFactory() }
					defaultSorted={ defaultSorted }
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
		updateDisplayEmployees: (employees) => dispatch(updateDisplayEmployees(employees)),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

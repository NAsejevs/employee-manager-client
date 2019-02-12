import { connect } from "react-redux";
import React from "react";

import { Badge, Image, OverlayTrigger, Tooltip, Form, Row, Col } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter, Comparator } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

import { LinkContainer } from "react-router-bootstrap";

import { updateDisplayEmployees } from "../actions/employeeActions";

import { addZero, getServerEmployees, setServerEmployeeWorking } from "../utils/utils";

import cancel from "../images/cancel.png";
import checkmark from "../images/checkmark.png";
import user from "../images/user.png";

import "../styles/main.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "../styles/table.css";

import ContainerBox from "./ContainerBox";


class Employees extends React.Component {

	constructor() {
		super();

		this.state = {
			updateInterval: null,
			employees: [],
			tableData: [],
			filter: {
				type: "",
				filters: "",
			},
		}
	}

	componentDidMount() {
		getServerEmployees().then((res) => {
			this.setEmployees(res);
		});
		
		this.setState({
			updateInterval: setInterval(() => {
				getServerEmployees().then((res) => {
					this.setEmployees(res);
				});
			}, 5000)
		});
	}

	componentWillUnmount() {
		clearInterval(this.state.updateInterval);
	}

	setEmployeeWorking = (id, working) => {
		setServerEmployeeWorking(id, working).then(() => {
			getServerEmployees().then((res) => {
				this.setEmployees(res);
			});
		});
	}

	onTableChange = (type, { filters }) => {
		this.setState({
			filter: { 
				type: type,
				filters: filters ? filters : "",
			},
		})

		this.formatTable();
		const result = this.state.tableData.filter((row) => {
			let valid = true;
			for (const dataField in filters) {
				const { filterVal, filterType, comparator } = filters[dataField];
	
				if (filterType === 'TEXT') {
					if (comparator === Comparator.LIKE) {
						valid = row[dataField].toString().indexOf(filterVal) > -1;
					} else {
						valid = row[dataField] === filterVal;
					}
				}
				if (!valid) break;
			}
			return valid;
		});
		this.setState(() => ({
			tableData: result
		}));
	}

	setEmployees = (res) => {
		this.setState({
			employees: res.data
		});

		this.formatTable();

		const filters = this.state.filter.filters;
		this.onTableChange(this.state.filter.type, { filters });
	}

	formatTable = () => {
		this.setState({ tableData: 
			this.state.employees.map((employee) => {
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
			})
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
			sort: true,
		}, {
			dataField: 'name',
			text: 'Vārds',
			sort: true,
			formatter: nameFormatter,
			filter: textFilter({
				placeholder: "Vārds...",
				caseSensitive: false,
				delay: 1,
			}),
			filterRenderer: null,
		}, {
			dataField: 'personalCode',
			text: 'Pers. Kods',
			sort: true,
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

		const paginationTotalRenderer = (from, to, size) => {
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
			paginationTotalRenderer: paginationTotalRenderer,
			sizePerPageList: [
				{
					text: "5",
					value: 5,
				},{
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
					value: this.state.employees.length,
				}
			]
		});

		return (
			<ContainerBox header={"Darbinieku Saraksts"}>
				<BootstrapTable 
					bootstrap4={ true }
					keyField='id' 
					data={ this.state.tableData } 
					columns={ columns } 
					bordered={ false }
					hover={ true }
					filter={ filterFactory() }
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
		updateDisplayEmployees: (employees) => dispatch(updateDisplayEmployees(employees)),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

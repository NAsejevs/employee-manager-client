import { connect } from "react-redux";
import React from "react";

import { Badge, Image, Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter, Comparator } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

import { updateEmployees } from "../actions/employeeActions";

import { addZero, getEmployees } from "../utils/utils";

import user from "../images/user.png";

import "../styles/main.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "../styles/table.css";

import ContainerBox from "./ContainerBox";
import ViewEmployee from "./ViewEmployee";
import Commands from "./Commands";


class Employees extends React.Component {

	constructor() {
		super();

		this.state = {
			workLogUserId: null,
			showWorkLogModal: false,
			updateInterval: null,
			tableData: [],
			filter: {
				type: "",
				filters: "",
			},
		}
	}

	componentDidMount() {
		getEmployees();

		this.setState({
			updateInterval: (
				setInterval(() => {
					getEmployees();
				}, 5000)
			),
		});
	}

	componentWillUnmount() {
		clearInterval(this.state.updateInterval);
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.employees !== this.props.employees) {
			const filters = this.state.filter.filters;
			this.onTableChange(this.state.filter.type, { filters });
		}
	}

	onTableChange = (type, newState) => {
		this.formatTable(() => {
			this.setState({
				filter: { 
					type: type,
					filters: newState.filters ? newState.filters : "",
				},
			});

			const result = this.state.tableData.filter((row) => {
				let valid = true;
				for (const dataField in newState.filters) {
					const { filterVal, filterType, comparator } = newState.filters[dataField];
		
					if (filterType === 'TEXT') {
						if (comparator === Comparator.LIKE) {
							valid = row[dataField].toString().toLowerCase().indexOf(filterVal.toLowerCase()) > -1;
						} else {
							valid = row[dataField] === filterVal;
						}
					}
					if (!valid) break;
				}
				return valid;
			});

			this.setState({
				tableData: result
			});
		});
	}

	formatTable = (callback = () => null) => {
		this.setState({ tableData: 
			this.props.employees.map((employee) => {
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
					commands: employee,
				});
			})
		}, () => {
			callback();
		});
	}

	showWorkLog = (userId) => {
		this.setState({
			workLogUserId: userId,
			showWorkLogModal: true,
		});
	}

	handleWorkLogClose = () => {
		this.setState({
			showWorkLogModal: false,
			workLogUserId: null,
		});
	}

	render() {
		const nameFormatter = (cell, row) => {
			return (
				<div>
					<Image src={user} width="20" height="20" className="mr-2"/>
					<Button variant="link" onClick={() => this.showWorkLog(row.employee.id)}>{cell}</Button>
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

		const commandFormatter = (cell, row) => {
			return (
				<Commands employee={row.employee}/>
			);
		};

		const columns = [{
			dataField: 'id',
			text: '#',
			sort: true,
			classes: "align-middle",
		}, {
			dataField: 'name',
			text: 'Vārds',
			sort: true,
			classes: "align-middle",
			formatter: nameFormatter,
			filter: textFilter({
				placeholder: "Vārds...",
				caseSensitive: false,
				delay: 1,
			}),
			filterRenderer: null,
		}, {
			dataField: 'status',
			text: 'Status',
			sort: true,
			classes: "align-middle",
			formatter: statusFormatter
		}, {
			dataField: 'commands',
			text: 'Komandas',
			classes: "align-middle",
			formatter: commandFormatter
		}];

		const defaultSorted = [{
			dataField: 'id',
			order: 'asc'
		}];

		const paginationTotalRenderer = (from, to, size) => {
			if(to === 0) {
				return(
					<span className="react-bootstrap-table-pagination-total">
						&nbsp;Netika atrasts neviens rezultāts
					</span>
				);
			}

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
			sizePerPage : 10,
			paginationTotalRenderer: paginationTotalRenderer,
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
					text: "Visi",
					value: this.props.employees.length,
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
				<ViewEmployee 
					showWorkLogModal={this.state.showWorkLogModal} 
					handleWorkLogClose={this.handleWorkLogClose}
					userId={this.state.workLogUserId}
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
		updateEmployees: (employees) => dispatch(updateEmployees(employees)),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Employees);

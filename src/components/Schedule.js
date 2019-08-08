import { connect } from "react-redux";
import React from "react";
import Cookies from 'universal-cookie';

import { Button, Dropdown } from "react-bootstrap";
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

import { daysInMonth, convertSpecialCharacters } from "../utils/commonUtils";

class Employees extends React.Component {

	constructor() {
		super();

		this.state = {
			workLogUserId: null,
			showWorkLogModal: false,
			tableData: [],
			pageSize: 10,
			scheduleData: [],
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

	onFilterChange = () => {
		this.onTableChange();
	}

	onDataFiltered = (data) => {
		this.setState({
			tableData: data
		});
	}

	onScheduleCellClick = (rowIndex, colIndex) => {

	}

	formatTable = (callback = () => null) => {
		const workLogFrom = new Date();
		workLogFrom.setHours(0, 0, 0);

		const workLogTo = new Date();
		workLogTo.setHours(23, 59, 59);

		let scheduleData = [];

		const promise = this.props.employees.map((employee) => {

			scheduleData.push({
				id: employee.id,
				name: employee.name
			});

			return({
				id: employee.id,
				name: employee.name,
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
				commands: employee,
			});
		});

		Promise.all(promise).then((data) => {
			callback(data);

			setTimeout(() => {
				console.log("setting schedule data");
				this.setState({
					scheduleData: scheduleData,
				});
			}, 5000);
		});
	}

	render() {
		const nameFormatter = (cell, row) => {
			return (
				<div>
					<nobr>
						<Button 
							variant="link" 
							onClick={() => this.props.showEmployeeWorkLog(cell.id)}
							style={{ color: "#0000FF", fontSize: "12px" }}
							className="m-0 p-0"
						>
							{cell.surname + " " + cell.name}
						</Button>
					</nobr>
				</div>
			);
		};

		const dayFormatter = (cell, row, rowIndex, data) => {
			let newScheduleData = data.scheduleData;
			let index = this.state.scheduleData.findIndex((element) => {
				return element.id === row.id;
			});

			console.log(index);

			const onClickInput = (event) => {
				event.target.select();
			}

			const onBlurInput = () => {
				this.setState({

				});
			}

			return (
				<input 
					onClick={onClickInput}
					onBlur={onBlurInput}
					className="border-0 text-center" 
					style={{ width: "32px", height: "32px", fontSize: "12px" }}
					value={"D"}
				/>
			);
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
			classes: "align-middle",
			formatter: nameFormatter,
		}];

		const days = daysInMonth(new Date().getMonth(), new Date().getFullYear());
		
		for(let i = 0; i < days; i++) {
			columns.push({
				dataField: (i + 1).toString(),
				text: (i + 1).toString(),
				formatter: dayFormatter,
				formatExtraData: { i, scheduleData: this.state.scheduleData },
				headerClasses: "text-center",
				classes: "p-0 m-0",
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
				<BootstrapTable 
					bootstrap4={ true }
					keyField="id"
					data={ this.state.tableData } 
					columns={ columns } 
					bordered={ false }
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

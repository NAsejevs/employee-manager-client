import { connect } from 'react-redux';
import React from 'react';
import { Table, Button } from 'react-bootstrap';

import { updateDisplayEmployees } from '../actions/employeeActions';

import { getServerEmployees, setServerEmployeeWorking } from '../utils/utils';

class Employees extends React.Component {

	componentDidMount() {
		getServerEmployees().then((res) => {
			this.props.updateDisplayEmployees(res.data);
		});
		
		setInterval(() => {
			getServerEmployees().then((res) => {
				this.props.updateDisplayEmployees(res.data);
			});
		}, 1000);
	}

	render() {
		const workingStyle = {
			backgroundColor: "#ccffcc",
		}

		const notWorkingStyle = null;

		const employees = this.props.employees.sort((a, b) => {
			return b.id - a.id
		}).map((employee, index) =>
			<tr key={index} style={employee.working ? workingStyle : notWorkingStyle}>
				<td>{employee.id}</td>
				<td>{employee.name}</td>
				<td>{employee.surname}</td>
				<td>{employee.personalCode}</td>
				<td>
					<Button 
						size="sm"
						variant={employee.working ? "danger" : "success"} 
						onClick={() => this.setEmployeeWorking(employee.id, !employee.working)}
					>
						{employee.working ? "AIZIET" : "IENĀKT"}
					</Button>
				</td>
			</tr>
		);

		return (
			<Table bordered hover size="sm">
				<thead>
					<tr>
					<th>#</th>
					<th>Vārds</th>
					<th>Uzvārds</th>
					<th>Personas Kods</th>
					<th>Komandas</th>
					</tr>
				</thead>
				<tbody>
					{employees}
				</tbody>
			</Table>
		);
	}

	setEmployeeWorking = (id, working) => {
		setServerEmployeeWorking(id, working).then(() => {
			getServerEmployees().then((res) => {
				this.props.updateDisplayEmployees(res.data);
			});
		});
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

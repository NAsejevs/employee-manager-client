import { connect } from 'react-redux';
import React from 'react';
import { Table } from 'react-bootstrap';

import { updateDisplayEmployees } from '../actions/employeeActions';

import { getServerEmployees } from '../utils/utils';

class Employees extends React.Component {

	componentDidMount() {
		getServerEmployees().then((res) => {
			this.props.updateDisplayEmployees(res.data);
		});
	}

	render() {
		const employees = this.props.employees.sort((a, b) => {
			return b.id - a.id
		}).map((employee, index) =>
			<tr key={index}>
				<td>{employee.id}</td>
				<td>{employee.name}</td>
				<td>{employee.surname}</td>
				<td>{employee.personalCode}</td>
				<td>{employee.age}</td>
			</tr>
		);

		return (
			<Table striped bordered hover>
				<thead>
					<tr>
					<th>#</th>
					<th>Vārds</th>
					<th>Uzvārds</th>
					<th>Personas Kods</th>
					<th>Vecums</th>
					</tr>
				</thead>
				<tbody>
					{employees}
				</tbody>
			</Table>
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

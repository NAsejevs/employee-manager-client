import { connect } from 'react-redux';
import React from 'react';
import { Table, Button, Row, Col, Form, FormControl } from 'react-bootstrap';

import { updateDisplayEmployees } from '../actions/employeeActions';

import { getServerEmployees, setServerEmployeeWorking } from '../utils/utils';

import '../styles/main.css';

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
			<Row>
				<Col>
					<Row>
						<Col className="searchBar">
								<Form inline>
									<Form.Label>Rādīt </Form.Label>
									<Form.Control as="select" className="entriesCount">
										<option>10</option>
										<option>25</option>
										<option>50</option>
										<option>100</option>
										<option>visus</option>
									</Form.Control>
									<Form.Label> ierakstus</Form.Label>
								</Form>
						</Col>
						<Col className="searchBar">
							<Form inline className="justify-content-end">
								<FormControl type="text" className="mr-sm-2" />
								<Button variant="outline-success">Meklēt</Button>
							</Form>
						</Col>
					</Row>
					<Row>
						<Col>
							<Table hover size="sm">
								<thead>
									<tr>
									<th>#</th>
									<th>VĀRDS</th>
									<th>UZVĀRDS</th>
									<th>PERSONAS KODS</th>
									<th>KOMANDAS</th>
									</tr>
								</thead>
								<tbody>
									{employees}
								</tbody>
							</Table>
						</Col>
					</Row>
				</Col>
			</Row>
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

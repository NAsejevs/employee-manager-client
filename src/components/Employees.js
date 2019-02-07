import { connect } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Badge, Image, ButtonToolbar } from 'react-bootstrap';

import { updateDisplayEmployees } from '../actions/employeeActions';

import { getServerEmployees, setServerEmployeeWorking } from '../utils/utils';

import trash from '../images/trash.png';
import cancel from '../images/cancel.png';
import checkmark from '../images/checkmark.png';
import edit from '../images/edit.png';
import user from '../images/user.png';

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
			backgroundColor: "#ffffe6",
		}

		const notWorkingStyle = null;

		const employees = this.props.employees.sort((a, b) => {
			return b.id - a.id
		}).map((employee, index) =>
			<tr key={index} style={employee.working ? workingStyle : notWorkingStyle}>
				<td>{employee.id}</td>
				<td>
					<Image src={user} width="24" height="24"/>
					<Link to={`/employee/${employee.id}`}>
						{employee.name + " " + employee.surname}
					</Link>
				</td>
				<td>{employee.personalCode}</td>
				<td>
					<Badge 
						variant={employee.working ? "success" : "info"}
					>
						{employee.working ? "Strādā" : "Nestrādā"}
					</Badge>
				</td>
				<td>
					<ButtonToolbar>
						<Button 
							className="mr-2"
							size="sm"
							variant={employee.working ? "warning" : "success"} 
							onClick={() => this.setEmployeeWorking(employee.id, !employee.working)}
						>
							{
								employee.working 
								? <Image src={checkmark} width="24" height="24"/>
								: <Image src={cancel} width="24" height="24"/>
							}
						</Button>
						{/* <Button
							className="mr-2"
							size="sm"
							variant={"primary"} 
						>
							<Image src={edit} width="24" height="24"/>
						</Button>
						<Button 
							size="sm"
							variant={"danger"} 
						>
							<Image src={trash} width="24" height="24"/>
						</Button> */}
					</ButtonToolbar>
				</td>
			</tr>
		);

		return (
			<Modal.Dialog className="modalContainer">
				<Modal.Header>
					<Modal.Title>Darbinieku Saraksts</Modal.Title>
				</Modal.Header>
				<Table hover>
					<thead>
						<tr>
						<th>#</th>
						<th>VĀRDS</th>
						<th>PERSONAS KODS</th>
						<th>STATUS</th>
						<th>KOMANDAS</th>
						</tr>
					</thead>
					<tbody>
						{employees}
					</tbody>
				</Table>
			</Modal.Dialog>
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

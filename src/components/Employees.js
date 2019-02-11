import { connect } from "react-redux";
import React from "react";
import { Table, Badge, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { updateDisplayEmployees } from "../actions/employeeActions";

import { getServerEmployees, setServerEmployeeWorking } from "../utils/utils";

// import trash from "../images/trash.png";
import cancel from "../images/cancel.png";
import checkmark from "../images/checkmark.png";
// import edit from "../images/edit.png";
import user from "../images/user.png";

import "../styles/main.css";
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

	render() {
		const workingStyle = {
			backgroundColor: "#ffffe6",
		}

		const employees = this.props.employees.sort((a, b) => {
			return b.id - a.id
		}).map((employee, index) =>
			<tr key={index} style={employee.working ? workingStyle : null}>
				<td>{employee.id}</td>
				<td>
					<Image src={user} width="20" height="20" className="mr-2"/>
					<LinkContainer to={`/employee/${employee.id}`}>
						<a href="#">{employee.name + " " + employee.surname}</a>
					</LinkContainer>
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
				</td>
			</tr>
		);

		return (
			<ContainerBox header={"Darbinieku Saraksts"}>
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
			</ContainerBox>
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

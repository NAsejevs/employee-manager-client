import React from "react";
import { connect } from "react-redux";
import { 
	Button, 
	Dropdown 
} from "react-bootstrap";

import { 
	setServerEmployeeWorking, 
	setServerEmployeeArchived, 
	setServerEmployeeActive, 
	getEmployees 
} from "../utils/employeeUtils";

import { 
	showDeleteEmployee, 
	hideDeleteEmployee,
	showEditEmployee,
	hideEditEmployee
} from "../actions/employeeActions";

import { 
	FiMoreHorizontal, 
	FiTrash, 
	FiEdit, 
	FiUserCheck, 
	FiUserX, 
	FiArchive, 
	FiX,
	FiCheck
} from "react-icons/fi";

class commandButton extends React.Component {
	render() {
		return (
			<Button variant="link" onClick={this.props.onClick}>
				<FiMoreHorizontal/>
			</Button>
		);
	}
}

const Commands = (props) => {
	return (
		<Dropdown alignRight>
			<Dropdown.Toggle as={commandButton} id="dropdown-custom-components"/>
			<Dropdown.Menu>
				<Dropdown.Item eventKey="1">
					<Button
						variant="link"
						size="sm"
						onClick={() => setServerEmployeeWorking(props.employee.id, !props.employee.working).then(() => {
							getEmployees();
						})}
					>
						{
							props.employee.working 
							? <FiUserX className="mr-2 mb-1"/>
							: <FiUserCheck className="mr-2 mb-1"/>
						}
						Atzīmēt kā {props.employee.working ? "izgājušu" : "ienākušu"}
					</Button>
				</Dropdown.Item>
				<Dropdown.Item eventKey="2">
					<Button 
						variant="link" 
						size="sm"
						onClick={() => props.showEditEmployee(props.employee)}
					>
						<span>
							<FiEdit className="mr-2 mb-1"/>
							Rediģēt
						</span>
					</Button>
				</Dropdown.Item>
				<Dropdown.Item eventKey="3">
					<Button 
						variant="link" 
						size="sm"
						onClick={() => setServerEmployeeArchived(props.employee.id, !props.employee.archived).then(() => {
							getEmployees();
						})}
					>
						<FiArchive height="100%" width="auto" className="mr-2 mb-1"/>
						{ props.employee.archived ? "Izņemt no arhīva" : "Arhivēt" }
					</Button>
				</Dropdown.Item>
				<Dropdown.Item eventKey="4">
					<Button 
						variant="link" 
						size="sm"
						onClick={() => setServerEmployeeActive(props.employee.id, !props.employee.active).then(() => {
							getEmployees();
						})}
					>
						{ 
							props.employee.active 
							? <FiX height="100%" width="auto" className="mr-2 mb-1"/>
							: <FiCheck height="100%" width="auto" className="mr-2 mb-1"/>
						}
						{ 
							props.employee.active 
							? "Deaktivizēt" 
							: "Aktivizēt"
						}
					</Button>
				</Dropdown.Item>
				<Dropdown.Item eventKey="5">
					<Button 
						variant="link" 
						size="sm"
						onClick={() => props.showDeleteEmployee(props.employee)}
					>
						<FiTrash height="100%" width="auto" className="mr-2 mb-1"/>
						Dzēst
					</Button>
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

function mapStateToProps(state) {
	return {
		deleteEmployee: state.employees.deleteEmployee,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showDeleteEmployee: (employee) => dispatch(showDeleteEmployee(employee)),
		hideDeleteEmployee: () => dispatch(hideDeleteEmployee()),
		showEditEmployee: (employee) => dispatch(showEditEmployee(employee)),
		hideEditEmployee: () => dispatch(hideEditEmployee()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Commands);
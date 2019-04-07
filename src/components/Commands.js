import React from "react";
import { connect } from "react-redux";
import { Image, OverlayTrigger, Tooltip, Button, Dropdown, ButtonToolbar, DropdownButton } from "react-bootstrap";

import { setServerEmployeeWorking, getEmployees } from "../utils/employeeUtils";

import { 
	showDeleteEmployee, 
	hideDeleteEmployee,
	showEditEmployee,
	hideEditEmployee,
} from "../actions/employeeActions";

import cancel from "../images/cancel.png";
import checkmark from "../images/checkmark.png";
import edit from "../images/edit.png";
import trash from "../images/trash.png";

const Commands = (props) => {

	const imageStyle = {
		filter: "invert(100%)",
	}

	return (
		<Dropdown>
			<Dropdown.Toggle as={Button} id="dropdown-custom-components">
				Custom toggle
			</Dropdown.Toggle>

			<Dropdown.Menu>
			<Dropdown.Item eventKey="1">
				<Button
					variant={props.employee.working ? "secondary" : "success"}
					size="sm" 
					className="w-100"
					onClick={() => setServerEmployeeWorking(props.employee.id, !props.employee.working).then(() => {
						getEmployees();
					})}
				>
					<OverlayTrigger
						placement={"top"}
						overlay={
							<Tooltip id={`tooltip-top`}>
								Atzīmēt kā {props.employee.working ? "izgājušu" : "ienākušu"}
							</Tooltip>
						}
					>
						<span>
							{
								props.employee.working 
								? <Image src={cancel} width="20" height="auto" style={imageStyle}/>
								: <Image src={checkmark} width="20" height="auto" style={imageStyle}/>
							}
							Atzīmēt kā {props.employee.working ? "izgājušu" : "ienākušu"}
						</span>
					</OverlayTrigger>
				</Button>
			</Dropdown.Item>
			<Dropdown.Item eventKey="2">
				<Button 
					variant="warning" 
					size="sm" 
					className="w-100" 
					onClick={() => props.showEditEmployee(props.employee)}
				>
					<OverlayTrigger
						placement={"top"}
						overlay={
							<Tooltip id={`tooltip-top`}>
								Rediģēt
							</Tooltip>
						}
					>
						<span>
							{
								<Image src={edit} width="20" height="auto" style={imageStyle}/>
							}
						</span>
					</OverlayTrigger>
				</Button>
			</Dropdown.Item>
			<Dropdown.Item eventKey="3">
				<Button 
					variant="danger" 
					size="sm"
					className="w-100"
					onClick={() => props.showDeleteEmployee(props.employee)}
				>
					<OverlayTrigger
						placement={"top"}
						overlay={
							<Tooltip id={`tooltip-top`}>
								Dzēst
							</Tooltip>
						}
					>
						<span>
							{
								<Image src={trash} width="20" height="auto" style={imageStyle}/>
							}
						</span>
					</OverlayTrigger>
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
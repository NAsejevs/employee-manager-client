import React from "react";
import { connect } from "react-redux";
import { Image, OverlayTrigger, Tooltip, Button } from "react-bootstrap";

import { setEmployeeWorking, editEmployee, deleteEmployee } from "../utils/utils";

import { showDeleteEmployee, hideDeleteEmployee } from "../actions/commandActions";

import cancel from "../images/cancel.png";
import checkmark from "../images/checkmark.png";
import edit from "../images/edit.png";
import trash from "../images/trash.png";

const Commands = (props) => {

	const imageStyle = {
		filter: "invert(100%)",
	}

	return (
		<div>
			<Button 
				size="sm" 
				className="mr-1"
				onClick={() => setEmployeeWorking(props.employee.id, !props.employee.working, (res) => {
					props.setEmployees(res);
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
					</span>
				</OverlayTrigger>
			</Button>
			<Button 
				variant="warning" 
				size="sm" 
				className="mr-1" 
				onClick={() => editEmployee(props.employee.id)}
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
			<Button 
				variant="danger" 
				size="sm"
				className="mr-1"
				onClick={() => props.showDeleteEmployee()}
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
		</div>
	);
};

function mapStateToProps(state) {
	return {
		deleteEmployee: state.employeeCommands.deleteEmployee,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showDeleteEmployee: () => dispatch(showDeleteEmployee()),
		hideDeleteEmployee: () => dispatch(hideDeleteEmployee()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Commands);
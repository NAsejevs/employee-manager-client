import React, { forwardRef } from "react";
import { connect } from "react-redux";
import { Button, Dropdown, Row, Col, Tooltip, OverlayTrigger} from "react-bootstrap";

import { 
	showDeleteEmployee,
	showEditEmployee,
	showCommentEmployee,
} from "../actions/employeeActions";

import { 
	setServerEmployeeWorking, 
	setServerEmployeeArchived, 
	setServerEmployeeActive,
	storeUpdateEmployee
} from "../utils/employeeUtils";

import { FiMoreHorizontal, FiTrash, FiEdit,FiArchive, FiX,FiCheck } from "react-icons/fi";

const CommandButton = forwardRef((props, ref) => {
	return <Button ref={ref} variant="link" onClick={props.onClick}>
		<FiMoreHorizontal/>
	</Button>
});

const Commands = (props) => {
	return (
		<Row className="justify-content-end">
			<Col xs="auto" className="d-inline-block">
				<Dropdown>
					<Dropdown.Toggle as={CommandButton}/>
					<Dropdown.Menu flip={true} alignRight={true}>
						<Dropdown.Item 
							eventKey="1"
							onClick={() => props.showEditEmployee(props.employee)}
						>
							<FiEdit className="mr-2 mb-1"/>
							Rediģēt
						</Dropdown.Item>
						<Dropdown.Item 
							eventKey="2"
							onClick={() => setServerEmployeeArchived(props.employee.id, !props.employee.archived).then(() => {
								storeUpdateEmployee(props.employee.id);
							})}
						>
							<FiArchive height="100%" width="auto" className="mr-2 mb-1"/>
							{ props.employee.archived ? "Izņemt no arhīva" : "Arhivēt" }
						</Dropdown.Item>
						<Dropdown.Item 
							eventKey="3"
							onClick={() => setServerEmployeeActive(props.employee.id, !props.employee.active).then(() => {
								storeUpdateEmployee(props.employee.id);
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
						</Dropdown.Item>
						<Dropdown.Item 
							eventKey="4"
							onClick={() => props.showDeleteEmployee(props.employee)}
						>
							<FiTrash height="100%" width="auto" className="mr-2 mb-1"/>
							Dzēst
						</Dropdown.Item>
						<Dropdown.Item 
							eventKey="5"
							onClick={() => props.showCommentEmployee(props.employee)}
						>
							<FiEdit className="mr-2 mb-1"/>
							Pievienot Komentāru
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Col>
			<Col xs="auto" className="d-inline-block">
				<OverlayTrigger
					placement={"top"}
					overlay={
						<Tooltip>
							Atzīmēt kā {props.employee.working ? "izgājušu" : "ienākušu"}
						</Tooltip>
					}
				>
					<Button
						onClick={() => setServerEmployeeWorking(props.employee.id, !props.employee.working).then(() => {
							storeUpdateEmployee(props.employee.id);
						})}
						variant={props.employee.working ? "danger" : "success"}
					>

						{
							props.employee.working 
							? <FiX/>
							: <FiCheck/>
						}
					</Button>
				</OverlayTrigger>
			</Col>
		</Row>
	);
};

function mapStateToProps() {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {
		showDeleteEmployee: (employee) => dispatch(showDeleteEmployee(employee)),
		showEditEmployee: (employee) => dispatch(showEditEmployee(employee)),
		showCommentEmployee: (employee) => dispatch(showCommentEmployee(employee)),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Commands);

import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Row, Col, Table, Form } from "react-bootstrap";
import BoostrapDatePicker from "./BoostrapDatePicker";
import download from "downloadjs";

import { showExportExcel, hideExportExcel } from "../actions/employeeActions";

import { exportServerEmployees } from "../utils/employeeUtils";

class ExportExcel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			month: new Date(),
			employeeList: [],
			checkAll: false,
			includeNoHours: false,
			includeInactive: false,
			includeArchived: false
		}
	}

	handleDateChange = (date) => {
		this.setState({
			month: date,
		});
	}

	onToggleIncludeNoHours = () => {
		this.setState({
			includeNoHours: !this.state.includeNoHours
		});
	}

	onToggleIncludeInactive = () => {
		this.setState({
			includeInactive: !this.state.includeInactive
		});
	}

	onToggleIncludeArchived = () => {
		this.setState({
			includeArchived: !this.state.includeArchived
		});
	}

	onEmployeeCheck = (index) => {
		const newList = this.state.employeeList;
		newList[index].checked = !newList[index].checked;

		this.setState({
			employeeList: newList
		});
	}

	onCheckAll = () => {
		this.setState({
			employeeList: this.state.employeeList.map(employee => {
				return {
					...employee,
					checked: !this.state.checkAll
				}
			}),
			checkAll: !this.state.checkAll
		});
	}

	export = () => {
		exportServerEmployees({
			month: this.state.month,
			employees: this.state.employeeList.filter(employee => {
				return employee.checked;
			}),
			includeNoHours: this.state.includeNoHours,
			includeInactive: this.state.includeInactive,
			includeArchived: this.state.includeArchived
		}).then((response) => {
			const content = response.headers["content-type"];
           	download(response.data, "Varpas 1.xlsx", content);
		});
	}

	onEnter = () => {
		this.setState({
			employeeList: this.props.employees.map(employee => {
				return {
					...employee,
					checked: false
				}
			})
		});
	}

	render() {
		if(!this.props.exportExcel.show) return null;

		const employees = this.state.employeeList.map((employee, index) => {
			return (
				<tbody key={index}>
					<tr>
						<td>
							<Form.Check 
								type="checkbox"
								checked={employee.checked}
								onChange={() => this.onEmployeeCheck(index)}
							/>
						</td>
						<td>{employee.surname + " " + employee.name}</td>
						<td>{employee.personalCode}</td>
						<td>{employee.position}</td>
					</tr>
				</tbody>
			);
		});

		return (
			<Modal 
				size="lg"
				show={this.props.exportExcel.show}
				onEnter={() => this.onEnter()}
				onHide={() => this.props.hideExportExcel()}
			>
				<Modal.Header closeButton>
					<Modal.Title>Eksports</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Row>
						<Col>
							<h5>Periods</h5>
							<Form.Group as={Row} className="ml-1">
								<Form.Label column xs={"3"}>Mēnesis: </Form.Label>
								<Col>
									<BoostrapDatePicker
										dateFormat="MM.yyyy."
										selected={this.state.month}
										onChange={this.handleDateChange}
										showMonthYearPicker
									/>
								</Col>
							</Form.Group>
						</Col>
						<Col>
							<h5>Iekļaut</h5>
							<Form.Group as={Row} className="ml-1">
								<Col>
									<Form.Check 
										type="checkbox" 
										label="darbiniekus bez nostrādātām stundām"
										checked={this.state.includeNoHours}
										onChange={this.onToggleIncludeNoHours}
									/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} className="ml-1">
								<Col>
									<Form.Check 
										type="checkbox" 
										label="deaktivizētus darbiniekus"
										checked={this.state.includeInactive}
										onChange={this.onToggleIncludeInactive}
									/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} className="ml-1">
								<Col>
									<Form.Check 
										type="checkbox" 
										label="arhivētus darbiniekus"
										checked={this.state.includeArchived}
										onChange={this.onToggleIncludeArchived}
									/>
								</Col>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col>
							<h5>Atlasīt Darbiniekus</h5>
							<Table size="sm">
								<thead>
									<tr>
										<th>
											<Form.Check 
												type="checkbox"
												checked={this.state.checkAll}
												onChange={() => this.onCheckAll()}
											/>
										</th>
										<th>Vārds</th>
										<th>Personas Kods</th>
										<th>Amats</th>
									</tr>
								</thead>
								{employees}
							</Table>
						</Col>
					</Row>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="success" onClick={() => {
						this.export();
					}}>
						Eksportēt
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	return {
		exportExcel: state.employees.exportExcel,
		employees: state.employees.employees
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showExportExcel: () => dispatch(showExportExcel()),
		hideExportExcel: () => dispatch(hideExportExcel()),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ExportExcel);

import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import download from "downloadjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import BoostrapDatePicker from "./BoostrapDatePicker";

import { showExportExcel, hideExportExcel } from "../actions/employeeActions";

import { exportServerEmployees } from "../utils/employeeUtils";

class ExportExcel extends React.Component {
	constructor() {
		super();

		this.state = {
			month: new Date()
		}
	}

	handleDateChange = (date) => {
		this.setState({
			month: date,
		});
	}

	export = () => {
		exportServerEmployees().then((response) => {
			const content = response.headers["content-type"];
           	download(response.data, "Varpas 1.xlsx", content);
		});
	}

	render() {
		return (
			<Modal 
				centered
				show={this.props.exportExcel.show}
				onHide={() => this.props.hideExportExcel()}
			>
				<Modal.Header closeButton>
					<Modal.Title>Eksportēt darba laika atskaiti</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					Nepabeigts... (work in progress)
					<br/>
					<br/>
					<br/>

					Mēnesis: 
					<DatePicker
						dateFormat="yyyy/MM"
						customInput={<BoostrapDatePicker />}
						selected={new Date()}
						onChange={this.handleDateChange}
						showMonthYearPicker
					/>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={() => this.props.hideExportExcel()}>Atcelt</Button>
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

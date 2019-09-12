import React from "react";

class ScheduleCell extends React.Component {
	constructor() {
		super();

		this.transparentColor = "RGBA(0, 0, 0, 0)";
		this.dayColor = "yellow";
		this.nightColor = "blue";
		this.dayOffColor = "gray";
		this.vacationColor = "green";
		this.sickListColor = "cyan";
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.row.selectedFields.find((selectedField) => {
			return selectedField[1] === this.props.rowIndex &&
			selectedField[2] === this.props.extraData.colIndex;
		}) || this.props.row.selectedFields.find((selectedField) => {
			return selectedField[1] === this.props.rowIndex &&
			selectedField[2] === this.props.extraData.colIndex;
		})) {
			return true;
		}
		if(JSON.stringify(nextProps.row.schedule.days[nextProps.extraData.colIndex]) !== 
			JSON.stringify(this.props.row.schedule.days[this.props.extraData.colIndex])) {
			return true;
		}
		return false;
	}

	render() {
		const rowIndex = this.props.rowIndex;
		const colIndex = this.props.extraData.colIndex;
		let selectedFields = this.props.row.selectedFields;

		let color = this.transparentColor;

		switch(this.props.row.schedule.days[colIndex]) {
			case "D": {
				color = this.dayColor;
				break;
			}
			case "N": {
				color = this.nightColor;
				break;
			}
			case "B": {
				color = this.dayOffColor;
				break;
			}
			case "A": {
				color = this.vacationColor;
				break;
			}
			case "S": {
				color = this.sickListColor;
				break;
			}
			default: {
				color = this.transparentColor;
				break;
			}
		}

		for(let i = 0; i < selectedFields.length; i++) {
			if(selectedFields[i][1] === rowIndex &&
				selectedFields[i][2] === colIndex) {
				color = "RGBA(1, 1, 1, 0.3)";
			}
		}
		
		return (
			<div style={{ backgroundColor: color }}>
				<input 
					onFocus={(event) => this.props.onClickScheduleInput(event, this.props.row.scheduleIndex, rowIndex, colIndex)}
					onChange={(event) => this.props.onChangeScheduleInput(event, this.props.row.scheduleIndex, rowIndex, colIndex)}
					className="border-0 text-center" 
					style={{ width: "32px", height: "32px", fontSize: "12px", backgroundColor: "RGBA(0, 0, 0, 0)"}}
					value={this.props.row.schedule.days[colIndex]}
				/>
			</div>
		);
	}
}

export default ScheduleCell;

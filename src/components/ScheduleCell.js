import React from "react";

class ScheduleCell extends React.Component {
	
	shouldComponentUpdate(nextProps, nextState) {
		const {cell, row, rowIndex, extraData} = {...this.props};

		let scheduleIndex = this.props.extraData.schedules.findIndex((schedule) => {
			return schedule.employee_id === row.id;
		});

		if(JSON.stringify(nextProps.extraData.schedules[scheduleIndex]) !== JSON.stringify(this.props.extraData.schedules[scheduleIndex])) return true;
		return false;
	}

	render() {
		console.log("cell render");
		const {cell, row, rowIndex, extraData} = {...this.props};

		const colIndex = extraData.colIndex;
		let selectedFields = [...extraData.selectedFields];
		let schedules = [...extraData.schedules];

		let color = this.transparentColor;

		switch(cell) {
			case "d":
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

		let scheduleIndex = schedules.findIndex((schedule) => {
			return schedule.employee_id === row.id;
		});

		for(let i = 0; i < selectedFields.length; i++) {
			if(selectedFields[i][1] === rowIndex &&
				selectedFields[i][2] === colIndex) {
				color = "RGBA(1, 1, 1, 0.3)";
			}
		}
		
		return (
			<div style={{ backgroundColor: color }}>
				<input 
					onFocus={(event) => this.props.onClickScheduleInput(event, cell, row, rowIndex, colIndex, selectedFields, schedules, scheduleIndex)}
					onChange={(event) => this.props.onChangeScheduleInput(event, cell, row, rowIndex, colIndex, selectedFields, schedules, scheduleIndex)}
					className="border-0 text-center" 
					style={{ width: "32px", height: "32px", fontSize: "12px", backgroundColor: "RGBA(0, 0, 0, 0)"}}
					value={
						scheduleIndex === -1
						? ""
						: schedules[scheduleIndex].days[colIndex]
					}
				/>
			</div>
		);
	}
}

export default ScheduleCell;

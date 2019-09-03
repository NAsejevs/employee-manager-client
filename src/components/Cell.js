import React from "react";

class Cell extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.day !== this.props.day) {
			return true;
		}
		return false;
	}

	render() {
		return (
			<input
				value={this.props.day}
				onChange={(e) => this.props.onChange(e, this.props.scheduleIndex, this.props.dayIndex)}
			/>
		);
	}
}

export default Cell;

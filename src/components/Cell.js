import React from "react";

class Cell extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.day !== this.props.day) {
			return true;
		}
		return false;
	}

	onBlur = (e) => {
		if(e.target.innerHTML !== this.props.day) {
			console.log("e.target.value: ", e.target.value);
			console.log("this.props.day: ", this.props.day);
			this.props.onChange(e, this.props.scheduleIndex, this.props.dayIndex);
		}
	}

	render() {
		return (
			<div
				style={{ backgroundColor: "#fafafa" }}
				className="w-100 h-100"
				contentEditable
				suppressContentEditableWarning
				onBlur={e => this.onBlur(e)}
				dangerouslySetInnerHTML={{
					__html: this.props.day
				}}
			/>
		);
	}
}

export default Cell;

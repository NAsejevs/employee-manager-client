import React from "react";

class InputCell extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
            if(JSON.stringify(nextProps.value[nextProps.colId]) !== JSON.stringify(this.props.value[this.props.colId])) {
            return true;
        }
        return false;
    }

	render() {
        console.log("cell re-rendered");
		return (
            <input
                key={[this.props.original.scheduleIndex, this.props.colId]}
				value={this.props.value[this.props.colId]}
                onChange={this.props.onChange}
                style={{ maxWidth: "32px", width: "100%" }}
			/>
		);
	}
}

export default InputCell;

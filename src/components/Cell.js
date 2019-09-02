import React from "react";
import { connect } from "react-redux";

class Cell extends React.PureComponent {
	constructor() {
		super();
	}

	componentDidMount() {

	}

	render() {
		console.log("re-render");
		return (
			<input
				value={this.props.value.days[this.props.dayIndex]}
				onChange={(e) => this.props.onCellChange(e, {...this.props}, this.props.dayIndex)}
			/>
		);
	}
}

function mapStateToProps(state) {
	return {
	};
}

function mapDispatchToProps(dispatch) {
	return {
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Cell);

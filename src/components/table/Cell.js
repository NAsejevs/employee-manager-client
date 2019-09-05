import React from "react";

class Cell extends React.PureComponent {
    constructor() {
        super();
    }

	render() {
		return (
            <td>
                {this.props.data}
            </td>
		);
	}
}

export default Cell;

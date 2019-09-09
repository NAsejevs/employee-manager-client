import React from "react";

import Cell from "./Cell";

class Row extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
            return true;
        }
        return false;
    }

    splitData = () => {
        const data = this.props.columns.map((column, index) => {
            if(column.cellRenderer !== undefined) {
                const props = {
                    original: this.props.data,
                    value: this.props.data[column.accessor],
                    rowId: this.props.rowId,
                    colId: index,
                }
                return <td key={[this.props.data.id, index]}>{column.cellRenderer(props)}</td>
            } else {
                return <Cell 
                    key={[this.props.data.id, index]} 
                    data={this.props.data[column.accessor]}
                />
            }
        });

        return data;
    }

	render() {
        console.log("row re-rendered");
		return (
            <tr key={this.props.data.id}>
                {this.splitData()}
            </tr>
		);
	}
}

export default Row;

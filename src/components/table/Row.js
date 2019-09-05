import React from "react";

import Cell from "./Cell";

class Row extends React.Component {
    constructor() {
        super();

        this.state = {
            data: "",
        }
    }

    componentDidMount() {
        this.setState({
            ...this.props,
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("this.props.data: ", this.props.data.days[1]);
        console.log("nextProps.data: ", nextProps.data.days[1]);
        if(JSON.stringify(this.state.data) !== JSON.stringify(nextProps.data)) return true;
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
                return <td key={index}>{column.cellRenderer(props)}</td>
            } else {
                return <Cell 
                    key={index} 
                    data={this.props.data[column.accessor]}
                />
            }
        });

        return data;
    }

	render() {
        console.log("row re-rendered");
		return (
            <tr>
                {this.splitData()}
            </tr>
		);
	}
}

export default Row;

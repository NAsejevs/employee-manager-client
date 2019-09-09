import React from "react";

import Row from "./Row";

import "../../styles/table/index.css";

class Table extends React.PureComponent {
    constructor() {
        super();
    }

    renderColumns = () => {
        return (
            <tr>
                {
                    this.props.columns.map((column, index) => {
                        return (<th key={index}>{column.header}</th>)
                    })
                }
            </tr>
        );
    }

    renderRows = () => {
        const rows = this.props.data.map((row, index) => {
            return (
                <Row 
                    key={row.id} 
                    data={row}
                    columns={this.props.columns}
                    rowId={index}
                />
            );
        });
        return rows;
    }

	render() {
        console.log(" ----------- TABLE RE-RENDER ----------- ");
		return (
			<table>
                <thead>
                    {this.renderColumns()}
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
		);
	}
}

export default Table;

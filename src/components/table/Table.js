import React from "react";

import Row from "./Row";

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
                    onCellChange={this.props.onCellChange}
                />
            );
        });
        return rows;
    }

	render() {
        console.log("table re-rendered");
		return (
			<table>
                <tbody>
                    {this.renderColumns()}
                    {this.renderRows()}
                </tbody>
            </table>
		);
	}
}

export default Table;

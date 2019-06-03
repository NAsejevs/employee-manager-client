import React from "react";

const ContainerBox = (props) => {
	return (
		<div className="container-box">
			<div className="container-box-header">
				{props.header}
			</div>
			<div className="container-box-body">
				{props.children}
			</div>
		</div>
	);
}

export default ContainerBox;

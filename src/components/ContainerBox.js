import { connect } from 'react-redux';
import React from 'react';

import '../styles/main.css';

class ContainerBox extends React.Component {
	render() {
		return (
			<div className='container-box'>
				<div className='container-box-header'>
					{this.props.header}
				</div>
				<div className='container-box-body'>
					{this.props.children}
				</div>
			</div>
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
)(ContainerBox);

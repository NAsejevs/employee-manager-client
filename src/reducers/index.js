import { combineReducers } from 'redux';

import { employees } from './employeeReducer';

const rootReducer = combineReducers({
	employees: employees,
});

export default rootReducer;
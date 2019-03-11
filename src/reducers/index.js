import { combineReducers } from 'redux';

import { employees } from './employeeReducer';
import { employeeCommands } from './employeeCommandsReducer';

const rootReducer = combineReducers({
	employees: employees,
	employeeCommands: employeeCommands,
});

export default rootReducer;
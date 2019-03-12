import { employeeInitialState } from './state';
import { SHOW_DELETE_EMPLOYEE, HIDE_DELETE_EMPLOYEE } from '../actions/actionTypes';

export const employeeCommands = (state = employeeInitialState, action) => {
	switch (action.type) {
		case SHOW_DELETE_EMPLOYEE:
			return {
				...state,
				deleteEmployee: {
					...state.deleteEmployee,
					show: true,
					employee: action.payload,
				},
			}
		case HIDE_DELETE_EMPLOYEE:
			return {
				...state,
				deleteEmployee: {
					...state.deleteEmployee,
					show: false,
					id: {},
				},
			}
		default:
			return state;
	}
}
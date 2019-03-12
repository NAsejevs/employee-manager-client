import { employeeInitialState } from './state';
import {
	SHOW_DELETE_EMPLOYEE,
	HIDE_DELETE_EMPLOYEE,
	SHOW_EDIT_EMPLOYEE,
	HIDE_EDIT_EMPLOYEE,
} from '../actions/actionTypes';

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
					employee: {},
				},
			}
		case SHOW_EDIT_EMPLOYEE:
			return {
				...state,
				editEmployee: {
					...state.editEmployee,
					show: true,
					employee: action.payload,
				},
			}
		case HIDE_EDIT_EMPLOYEE:
			return {
				...state,
				editEmployee: {
					...state.editEmployee,
					show: false,
					employee: {},
				},
			}
		default:
			return state;
	}
}
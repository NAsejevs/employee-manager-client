import { employeeInitialState } from './state';
import { UPDATE_EMPLOYEES } from '../actions/actionTypes';

export const employees = (state = employeeInitialState, action) => {
	switch (action.type) {
		case UPDATE_EMPLOYEES:
			return {
				...state,
				employees: [...action.employees],
			}
		default:
			return state;
	}
}
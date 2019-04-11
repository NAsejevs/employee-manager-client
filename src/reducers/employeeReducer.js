import initialState from "../store/initialState";

import { 
	UPDATE_EMPLOYEES,
	SHOW_DELETE_EMPLOYEE, 
	HIDE_DELETE_EMPLOYEE, 
	SHOW_EDIT_EMPLOYEE, 
	HIDE_EDIT_EMPLOYEE,
	SHOW_REGISTER_EMPLOYEE,
	HIDE_REGISTER_EMPLOYEE,
	SHOW_EXPORT_EXCEL,
	HIDE_EXPORT_EXCEL
} from '../actions/actionTypes';

export const employees = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_EMPLOYEES:
			return {
				...state,
				employees: [...action.payload],
			}
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
		case SHOW_REGISTER_EMPLOYEE:
			return {
				...state,
				registerEmployee: {
					...state.registerEmployee,
					show: true,
				},
			}
		case HIDE_REGISTER_EMPLOYEE:
			return {
				...state,
				registerEmployee: {
					...state.registerEmployee,
					show: false,
				},
			}
		case SHOW_EXPORT_EXCEL:
			return {
				...state,
				exportExcel: {
					...state.exportExcel,
					show: true,
				},
			}
		case HIDE_EXPORT_EXCEL:
			return {
				...state,
				exportExcel: {
					...state.exportExcel,
					show: false,
				},
			}
		default:
			return state;
	}
}
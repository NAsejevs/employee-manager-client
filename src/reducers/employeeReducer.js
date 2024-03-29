import initialState from "../store/initialState";

import {
	UPDATE_USER,
	UPDATE_EMPLOYEES,
	UPDATE_EMPLOYEE,
	SHOW_DELETE_EMPLOYEE, 
	HIDE_DELETE_EMPLOYEE, 
	SHOW_EDIT_EMPLOYEE, 
	HIDE_EDIT_EMPLOYEE,
	SHOW_REGISTER_EMPLOYEE,
	HIDE_REGISTER_EMPLOYEE,
	SHOW_EXPORT_EXCEL,
	HIDE_EXPORT_EXCEL,
	SHOW_CHECK_CARD,
	HIDE_CHECK_CARD,
	SHOW_EMPLOYEE_WORK_LOG,
	HIDE_EMPLOYEE_WORK_LOG,
	SHOW_COMMENT_EMPLOYEE,
	HIDE_COMMENT_EMPLOYEE,
	UPDATE_NOTIFICATIONS,
	SHOW_NOTIFICATIONS,
	HIDE_NOTIFICATIONS,
	SHOW_PROCESS_NOTIFICATION,
	HIDE_PROCESS_NOTIFICATION,
	SHOW_HISTORY,
	HIDE_HISTORY,
} from '../actions/actionTypes';

export const employees = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_USER:
			return {
				...state,
				user: action.payload,
			}
		case UPDATE_EMPLOYEES:
			return {
				...state,
				employees: [...action.payload],
			}
		case UPDATE_EMPLOYEE: {
			return {
				...state,
				employees: state.employees.map((employee) => {
					return employee.id === action.payload.id
					? action.payload
					: employee
				})
			}
		}
		case SHOW_EMPLOYEE_WORK_LOG:
			return {
				...state,
				employeeWorkLog: {
					...state.employeeWorkLog,
					show: true,
					id: action.payload,
				},
			}
		case HIDE_EMPLOYEE_WORK_LOG:
			return {
				...state,
				employeeWorkLog: {
					...state.employeeWorkLog,
					show: false,
					id: null,
				},
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
		case SHOW_CHECK_CARD:
			return {
				...state,
				checkCard: {
					...state.checkCard,
					show: true,
				},
			}
		case HIDE_CHECK_CARD:
			return {
				...state,
				checkCard: {
					...state.checkCard,
					show: false,
				},
			}
		case SHOW_COMMENT_EMPLOYEE:
			return {
				...state,
				commentEmployee: {
					...state.commentEmployee,
					show: true,
					employee: action.payload,
				},
			}
		case HIDE_COMMENT_EMPLOYEE:
			return {
				...state,
				commentEmployee: {
					...state.commentEmployee,
					show: false,
					employee: {},
				},
			}
		case UPDATE_NOTIFICATIONS:
			return {
				...state,
				notifications: {
					...state.notifications,
					notifications: action.payload,
				},
			}
		case SHOW_NOTIFICATIONS:
			return {
				...state,
				notifications: {
					...state.notifications,
					show: true,
				},
			}
		case HIDE_NOTIFICATIONS:
			return {
				...state,
				notifications: {
					...state.notifications,
					show: false,
				},
			}
		case SHOW_PROCESS_NOTIFICATION:
			return {
				...state,
				processNotification: {
					...state.processNotification,
					notification: action.payload,
					show: true,
					justified: action.justified,
				},
			}
		case HIDE_PROCESS_NOTIFICATION:
			return {
				...state,
				processNotification: {
					...state.processNotification,
					notification: null,
					show: false,
				},
			}
		case SHOW_HISTORY:
				return {
					...state,
					history: {
						...state.history,
						show: true,
					},
				}
		case HIDE_HISTORY:
				return {
					...state,
					history: {
						...state.history,
						show: false,
					},
				}
		default:
			return state;
	}
}

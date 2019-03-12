import { SHOW_DELETE_EMPLOYEE, HIDE_DELETE_EMPLOYEE } from "./actionTypes";

export const showDeleteEmployee = (employee) => {
	return {
		type: SHOW_DELETE_EMPLOYEE,
		payload: employee,
	}
}

export const hideDeleteEmployee = () => {
	return {
		type: HIDE_DELETE_EMPLOYEE,
	}
}
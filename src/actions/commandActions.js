import { SHOW_DELETE_EMPLOYEE, HIDE_DELETE_EMPLOYEE } from "./actionTypes";

export const showDeleteEmployee = () => {
	return {
		type: SHOW_DELETE_EMPLOYEE,
	}
}

export const hideDeleteEmployee = () => {
	return {
		type: HIDE_DELETE_EMPLOYEE,
	}
}
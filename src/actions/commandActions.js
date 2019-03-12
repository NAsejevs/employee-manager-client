import {
	SHOW_DELETE_EMPLOYEE, 
	HIDE_DELETE_EMPLOYEE, 
	SHOW_EDIT_EMPLOYEE, 
	HIDE_EDIT_EMPLOYEE
} from "./actionTypes";

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

export const showEditEmployee = (employee) => {
	return {
		type: SHOW_EDIT_EMPLOYEE,
		payload: employee,
	}
}

export const hideEditEmployee = () => {
	return {
		type: HIDE_EDIT_EMPLOYEE,
	}
}
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
} from "./actionTypes";

export const updateEmployees = (employees) => {
	return {
		type: UPDATE_EMPLOYEES,
		payload: employees,
	}
}

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

export const showRegisterEmployee = () => {
	return {
		type: SHOW_REGISTER_EMPLOYEE,
	}
}

export const hideRegisterEmployee = () => {
	return {
		type: HIDE_REGISTER_EMPLOYEE,
	}
}

export const showExportExcel = () => {
	return {
		type: SHOW_EXPORT_EXCEL,
	}
}

export const hideExportExcel = () => {
	return {
		type: HIDE_EXPORT_EXCEL,
	}
}
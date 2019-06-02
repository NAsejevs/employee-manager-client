import { 
	UPDATE_EMPLOYEES,
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
} from "./actionTypes";

export const updateEmployees = (employees) => {
	return {
		type: UPDATE_EMPLOYEES,
		payload: employees,
	}
}

export const showEmployeeWorkLog = (employee) => {
	return {
		type: SHOW_EMPLOYEE_WORK_LOG,
		payload: employee,
	}
}

export const hideEmployeeWorkLog = () => {
	return {
		type: HIDE_EMPLOYEE_WORK_LOG,
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

export const showCheckCard = () => {
	return {
		type: SHOW_CHECK_CARD,
	}
}

export const hideCheckCard = () => {
	return {
		type: HIDE_CHECK_CARD,
	}
}

export const showCommentEmployee = (employee) => {
	return {
		type: SHOW_COMMENT_EMPLOYEE,
		payload: employee,
	}
}

export const hideCommentEmployee = () => {
	return {
		type: HIDE_COMMENT_EMPLOYEE,
	}
}
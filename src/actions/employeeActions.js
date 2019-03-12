import { UPDATE_EMPLOYEES } from "./actionTypes";

export const updateEmployees = (employees) => {
	return {
		type: UPDATE_EMPLOYEES,
		payload: employees,
	}
}
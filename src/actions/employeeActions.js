import { UPDATE_EMPLOYEES } from './actionTypes';

export const updateDisplayEmployees = (employees) => {
	return {
		type: UPDATE_EMPLOYEES,
		employees: employees,
	}
}
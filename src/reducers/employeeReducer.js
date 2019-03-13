import initialState from "../store/initialState";

import { UPDATE_EMPLOYEES } from '../actions/actionTypes';

export const employees = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_EMPLOYEES:
			return {
				...state,
				employees: [...action.payload],
			}
		default:
			return state;
	}
}
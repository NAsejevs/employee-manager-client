import axios from "axios";
import store from "../store/store";

import { updateEmployees } from "../actions/employeeActions";

const serverURL = "http://localhost:8080/";

const requestConfig = {
	headers: {
		"Content-Type": "application/json"
	}
};

// ------------ Server requests ------------
export const getServerEmployees = () => {
	return axios.post(serverURL + "getEmployees");
}

export const getServerEmployee = (id) => {
	return axios.post(serverURL + "getEmployee", { 
		id 
	}, requestConfig);
}

export const getServerEmployeeWorkLog = (id) => {
	return axios.post(serverURL + "getEmployeeWorkLog", { 
		id 
	}, requestConfig);
}

export const addServerEmployee = (employee) => {
	return axios.post(serverURL + "addEmployee", employee);
}

export const setServerEmployeeWorking = (id, working) => {
	return axios.post(serverURL + "setEmployeeWorking", {
		id, 
		working
	});
}

export const deleteServerEmployee = (id) => {
	return axios.post(serverURL + "deleteEmployee", {
		id
	});
}

export const editServerEmployee = (employee) => {
	return axios.post(serverURL + "editEmployee", {
		employee
	});
}
// ---------------------------------------

export const getEmployees = () => {
	getServerEmployees().then((res) => {
		store.dispatch(updateEmployees(res.data));
	});
}

export const setEmployeeWorking = (id, working, callback) => {
	setServerEmployeeWorking(id, working).then(() => {
		getServerEmployees().then((res) => {
			callback(res);
		});
	});
}

export const addZero = (i) => {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
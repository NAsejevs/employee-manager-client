import axios from "axios";

import { serverURL } from "../server/serverConfig";

import store from "../store/configureStore";

import { showDeleteEmployee } from "../actions/commandActions";

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
	return axios.post(serverURL + "createEmployee", employee);
}

export const setServerEmployeeWorking = (id, working) => {
	return axios.post(serverURL + "setEmployeeWorking", {
		id, 
		working
	});
}
// ---------------------------------------

export const setEmployeeWorking = (id, working, callback) => {
	setServerEmployeeWorking(id, working).then(() => {
		getServerEmployees().then((res) => {
			callback(res);
		});
	});
}

export const editEmployee = (id) => {
	console.log("edit");
}

export const deleteEmployee = (id) => {
	console.log("delete");
	store().dispatch(showDeleteEmployee());
}

export const addZero = (i) => {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
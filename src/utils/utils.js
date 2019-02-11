import axios from "axios";

import { serverURL } from "../server/serverConfig";

export const getServerEmployees = () => {
	return axios.post(serverURL + "getEmployees");
}

export const getServerEmployee = (id) => {
	return axios.post(serverURL + "getEmployee", { 
		id 
	});
}

export const getServerEmployeeWorkLog = (id) => {
	return axios.post(serverURL + "getEmployeeWorkLog", { 
		id 
	});
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

export const addZero = (i) => {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
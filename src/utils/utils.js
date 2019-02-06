import axios from 'axios';

import { serverURL } from '../server/serverConfig';

export const getServerEmployees = () => {
	return axios.post(serverURL + "retrieveEmployees");
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
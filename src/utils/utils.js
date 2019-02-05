import axios from 'axios';

import { serverURL } from '../server/serverConfig';

export const getServerEmployees = () => {
	return axios.post(serverURL + "retrieveEmployees");
}

export const addServerEmployee = (employee) => {
	return axios.post(serverURL + "createEmployee", employee);
}
import { request } from "./config";

export const initialSettings = {
	showFilters: false,
	showArchive: false,
	showInactive: false,
	showWorking: false,
	showNotWorking: true,
	nameFilter: "",
	positionFilter: "",
	companyFilter: "",
	pageSize: 10,
}

export const checkSession = () => {
	return request.post("/checkSession");
}

export const authenticate = (username, password, rememberMe) => {
	return request.post("/authenticate", {
		username,
		password,
		rememberMe
	});
}

export const logOut = () => {
	return request.post("/logOut");
}

export const getUserByUsername = (username) => {
	return request.post("/getUserByUsername", {
		username
	});
}

export const getUserByKey = () => {
	return request.post("/getUserByKey");
}
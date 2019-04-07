import { request } from "./config";

export const checkSession = () => {
	return request.post("/checkSession");
}

export const authenticate = (username, password) => {
	return request.post("/authenticate", {
		username,
		password
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
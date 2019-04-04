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

import axios from "axios";

export const production = false;

export const serverURL = production
	? "http://192.168.1.150:8080"
	: "http://localhost:8080";
export const employeeUpdateInterval = 10000;
export const workLogUpdateInterval = 10000;

export const request = axios.create({
	baseURL: serverURL,
	withCredentials: true,
});

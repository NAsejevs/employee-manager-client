import axios from "axios";

export const serverURL = "http://localhost:8080";
export const employeeUpdateInterval = 60000;
export const workLogUpdateInterval = 60000;

export const request = axios.create({
	baseURL: serverURL,
	withCredentials: true,
});

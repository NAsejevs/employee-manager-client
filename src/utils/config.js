import axios from "axios";

export const serverURL = "http://192.168.1.150:8080";

export const request = axios.create({
	baseURL: serverURL,
	withCredentials: true
});
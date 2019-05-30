import axios from "axios";

export const serverURL = "http://localhost:8080";

export const request = axios.create({
	baseURL: serverURL,
	withCredentials: true,
});

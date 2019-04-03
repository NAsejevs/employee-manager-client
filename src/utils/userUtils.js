import { request } from "./config";

export const authentication = () => {
	return request.post("/authenticate");
}

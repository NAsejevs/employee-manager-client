import store from "../store/store";
import { request } from "./config";
import { updateEmployees } from "../actions/employeeActions";

// ------------ Server requests ------------
export const getServerEmployees = () => {
	return request.post("/getEmployees");
}

export const getServerEmployee = (id) => {
	return request.post("/getEmployee", { 
		id 
	});
}

export const getServerEmployeeWorkLog = (id) => {
	return request.post("/getEmployeeWorkLog", { 
		id 
	});
}

export const addServerEmployee = (employee) => {
	return request.post("/addEmployee", employee);
}

export const setServerEmployeeWorking = (id, working) => {
	return request.post("/setEmployeeWorking", {
		id, 
		working
	});
}

export const deleteServerEmployee = (id) => {
	return request.post("/deleteEmployee", {
		id
	});
}

export const editServerEmployee = (employee) => {
	return request.post("/editEmployee", {
		employee
	});
}
// ---------------------------------------

export const getEmployees = () => {
	getServerEmployees().then((res) => {
		store.dispatch(updateEmployees(res.data));
	});
}

export const setEmployeeWorking = (id, working, callback) => {
	setServerEmployeeWorking(id, working).then(() => {
		getServerEmployees().then((res) => {
			callback(res);
		});
	});
}

export const addZero = (i) => {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}
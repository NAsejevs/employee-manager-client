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

export const getServerEmployeeWorkLogFromTo = (id, from, to) => {
	return request.post("/getEmployeeWorkLogFromTo", { 
		id,
		from,
		to
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

export const setServerEmployeeArchived = (id, archived) => {
	return request.post("/setArchivedEmployee", {
		id, 
		archived
	});
}

export const setServerEmployeeActive = (id, active) => {
	return request.post("/setActiveEmployee", {
		id, 
		active
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

export const exportServerEmployees = () => {
	return request.get("/export", {
		responseType: "blob"
	});
}

export const cardScanned = (uid) => {
	return request.post("/cardScanned", { 
		uid: uid 
	});
}

export const checkCard = (status) => {
	return request.post("/checkCard", { 
		status 
	}, {
		timeout: 1000,
	});
}

export const addCard = (id) => {
	return request.post("/addCard", {
		id
	});
}

export const changeCard = (id) => {
	return request.post("/changeCard", {
		id
	});
}

export const deleteCard = (id) => {
	return request.post("/deleteCard", {
		id
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
import { request } from "./config";
import store from "../store/store";
import { updateEmployees, updateEmployee } from "../actions/employeeActions";

export const storeUpdateEmployees = () => {
	return getServerEmployees().then((res) => {
		store.dispatch(updateEmployees(res.data));
	});
}

export const storeUpdateEmployee = (id) => {
	return getServerEmployee(id).then((res) => {
		store.dispatch(updateEmployee(res.data));
	});
}

// ------------ Server requests ------------
export const getServerEmployees = () => {
	return request.post("/getEmployees");
}

export const getServerEmployee = (id) => {
	return request.post("/getEmployee", { 
		id 
	});
}

export const getNotifications = () => {
	return request.post("/getNotifications");
}

export const getSchedules = (month) => {
	return request.post("/getSchedules", {
		month
	});
}

export const saveSchedules = (schedules) => {
	return request.post("/saveSchedules", {
		schedules
	});
}

export const getServerEmployeeWorkLog = (id, order = "DESC") => {
	return request.post("/getEmployeeWorkLog", { 
		id,
		order
	});
}

export const getServerEmployeeWorkLogFromTo = (id, from, to) => {
	return request.post("/getEmployeeWorkLogFromTo", { 
		id,
		from,
		to
	});
}

export const deleteServerWorkLog = (id, working, employeeId) => {
	return request.post("/deleteWorkLog", { 
		id,
		working,
		employeeId,
	});
}

export const editServerWorkLog = (id, startDate, endDate, working) => {
	return request.post("/editWorkLog", { 
		id,
		startDate,
		endDate,
		working,
	});
}

export const addServerEmployee = (employee) => {
	return request.post("/addEmployee", {
		employee
	});
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

export const exportServerEmployees = (settings) => {
	return request.post("/export", {
		settings
	}).then(() => {
		return request.get("/export", {
			responseType: "blob"
		})
	});
}

export const addEmployeeComment = (employee, comment) => {
	return request.post("/addEmployeeComment", {
		employee,
		comment,
	});
}

export const getEmployeeComments = (id) => {
	return request.post("/getEmployeeComments", {
		id,
	});
}

export const deleteEmployeeComment = (commentId) => {
	return request.post("/deleteEmployeeComment", {
		commentId,
	});
}

// ------------ Card manipulation ------------

export const cardScanned = (uid) => {
	return request.post("/cardScanned", { 
		uid: uid,
		admin: 1,
	});
}

export const getEmployeeByUID = (uid) => {
	return request.post("/getEmployeeByUID", {
		uid,
	});
}

export const setEmployeeUID = (uid, id) => {
	return request.post("/setEmployeeUID", {
		uid,
		id
	});
}

export const removeEmployeeUID = (id) => {
	return request.post("/removeEmployeeUID", {
		id
	});
}

export const awaitCard = () => {
	return request.post("/awaitCard");
}

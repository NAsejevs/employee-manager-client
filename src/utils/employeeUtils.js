import { request } from "./config";
import store from "../store/store";
import { updateEmployees, updateEmployee, updateNotifications } from "../actions/employeeActions";
import * as LOG_TYPE from "../utils/logTypes";

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

export const addNotification = (type, data) => {
	return request.post("/addNotification", { type, data }).then(() => {
		getNotifications().then(res => {
			store.dispatch(updateNotifications(res.data));
		})
	});
}

export const updateNotification = (id, type, data) => {
	return request.post("/updateNotification", { id, type, data }).then(() => {
		getNotifications().then(res => {
			store.dispatch(updateNotifications(res.data));
		})
	});
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

export const editServerWorkLog = (workLogId, startDate, endDate, working, employeeId, prevWorkLog) => {
	const from = {
		startDate: JSON.stringify(prevWorkLog.start_time),
		endDate: JSON.stringify(prevWorkLog.end_time),
	}

	const to = {
		startDate: JSON.stringify(startDate),
		endDate: JSON.stringify(endDate),
	}

	console.log(from);
	console.log(to);

	addNotification(LOG_TYPE.LOG_EDIT_WORK_LOG, { 
		user: store.getState().employees.user.username, 
		id: employeeId, 
		startDate,
		endDate,
		from,
		to});

	console.log("workLogId: ", workLogId);
	return request.post("/editWorkLog", { 
		workLogId,
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
	if(working) {
		addNotification(LOG_TYPE.LOG_SET_WORKING, { user: store.getState().employees.user.username, id });
	} else {
		addNotification(LOG_TYPE.LOG_SET_NOT_WORKING, { user: store.getState().employees.user.username, id });
	}
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
	addNotification(LOG_TYPE.LOG_EDIT_EMPLOYEE, { user: store.getState().employees.user.username, id: employee.id });
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

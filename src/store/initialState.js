const initialState = {
	user: null,
	employees: [],
	employeeWorkLog: {
		show: false,
		id: null,
	},
	deleteEmployee: {
		show: false,
		employee: {},
	},
	editEmployee: {
		show: false,
		employee: {},
	},
	registerEmployee: {
		show: false,
	},
	exportExcel: {
		show: false,
	},
	checkCard: {
		show: false,
	},
	commentEmployee: {
		show: false,
		employee: {},
	},
	notifications: {
		show: false,
		notifications: [],
	},
	processNotification: {
		show: false,
		notification: null,
		justified: false,
	},
	processedNotification: {
		show: false,
		notifications: [],
	},
	history: {
		show: false,
	},
};

export default initialState;

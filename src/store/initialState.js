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
		data: [],
	},
	history: {
		show: false,
	},
};

export default initialState;

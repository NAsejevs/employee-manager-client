const initialState = {
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
	}
};

export default initialState;
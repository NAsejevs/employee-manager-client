const sqlite3 = require('sqlite3').verbose();
let db = null;

// --- SQLite3 cheat sheet ---
// https://github.com/mapbox/node-sqlite3/wiki/API
// db.all : query multiple rows
// db.get : query 0 or 1 row
// db.each : call callback for every row in result
// db.run : create/alter tables or indert/update table data

module.exports.connect = () => {
	db = new sqlite3.Database('database.db', (err) => {
		if (err) {
			console.log("Failed to connect to database: ", err);
		} else {
			console.log("Connected to the database!");
		}
	});
}

module.exports.getEmployees = (callback) => {
	db.all(`SELECT * FROM employees`, (err, rows) => {
		if (err) {
			console.log(err);
		} else {
			callback(rows);
		}
	});
}

module.exports.addEmployee = (employee, callback) => {
	const query = `INSERT INTO employees (
		name, 
		surname, 
		personalCode
	) VALUES (
		"${employee.name}", 
		"${employee.surname}",
		"${employee.personalCode}"
	)`;

	db.run(query, (err) => {
		if (err) {
			console.log(err);
		} else {
			callback();
		}
	});
}

module.exports.setEmployeeWorking = (id, working, callback) => {
	const query = `UPDATE employees SET 
		working = ${working} 
		WHERE id = ${id}`;

	db.run(query, (err) => {
		if (err) {
			console.log(err);
		} else {
			callback();
		}
	});
}
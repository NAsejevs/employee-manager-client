const sqlite3 = require('sqlite3').verbose();
let db = null;

module.exports.connect = () => {
	db = new sqlite3.Database('database.db', (err) => {
		if (err) {
			console.log("Failed to connect to database: ", err);
		} else {
			console.log("Connected to the database!");
		}
	});
}

module.exports.getEmployees = () => {
	db.all("SELECT * FROM employees", (err, row) => {
		if (err) {
			console.log(err);
		} else {
			console.log(row);
		}
	});

	db.close();
}
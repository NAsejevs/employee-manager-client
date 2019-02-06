const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const db = require('./database');

let employees = [];

const employeeDirectory = "employees/";

const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200
};

// Middleware
app.use(
	cors(corsOptions), // User CORS to restric connections from anywhere other than localhost
	bodyParser.json() // Parse JSON requests
);

// Start the server!
const server = app.listen(8080, () => {
	console.log("Server started...\nPORT: 8080");
});

// Server is on and is ready to listen and respond!
server.on('listening', () => {
	// Retrieve employee information from ./employees folder and store it in employees variable.
	fs.readdirSync(employeeDirectory).forEach(file => {
		employees.push(
			JSON.parse(fs.readFileSync(employeeDirectory + file, 'utf-8'))
		);
	});

	// Initialize database.
	db.connect();
	employees = db.getEmployees((employees) => {
		console.log("Connected to the DB and got employees (", employees.length, "): \n", employees);
	});
});

// Create employee file in relative folder and add the employee to they employee array.
app.post("/createEmployee", (req, res) => {
	db.addEmployee(req.body, () => {
		res.end();
	});
});

// Send the client the full list of employees.
app.post("/retrieveEmployees", (req, res) => {
	db.getEmployees((employees) => {
		res.send(employees);
		res.end();
	});
});

// Send the client the full list of employees.
app.post("/setEmployeeWorking", (req, res) => {
	db.setEmployeeWorking(req.body.id, req.body.working, () => {
		res.end();
	});
});
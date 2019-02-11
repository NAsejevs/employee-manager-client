const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./database");

let employees = [];

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
server.on("listening", () => {
	// Initialize database.
	db.connect();
	employees = db.getEmployees((employees) => {
		//console.log("Connected to the DB and got employees (", employees.length, "): \n", employees);
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

// Send the client a signle employee by ID.
app.post("/getEmployee", (req, res) => {
	db.getEmployee(req.body.id, (employee) => {
		res.send(employee);
		res.end();
	});
});

// Send the client a signle employee by ID.
app.post("/getEmployeeWorkLog", (req, res) => {
	db.getEmployeeWorkLog(req.body.id, (workLog) => {
		res.send(workLog);
		res.end();
	});
});

// Toggle the employee"s working state
app.post("/setEmployeeWorking", (req, res) => {
	db.setEmployeeWorking(req.body.id, req.body.working, () => {
		res.end();
	});
});
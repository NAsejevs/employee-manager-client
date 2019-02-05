const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const db = require('./database');

const employees = [];

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
	db.getEmployees();
});

// Create employee file in relative folder and add the employee to they employee array.
app.post("/createEmployee", (req, res) => {
	if (!fs.existsSync(employeeDirectory)) {
		fs.mkdirSync(employeeDirectory);
	}

	req.body = {id: employees.length, ...req.body};

	const fileName = req.body.name + "_" + req.body.surname + ".json";
	const fileContent = JSON.stringify(req.body);

	fs.writeFile(employeeDirectory + fileName, fileContent, (err) => {
		if (err) {
			console.log(err);
		}
	});

	employees.push(req.body);

	res.end();
});

// Send the client the full list of employees.
app.post("/retrieveEmployees", (req, res) => {
	res.send(employees);
	res.end();
});
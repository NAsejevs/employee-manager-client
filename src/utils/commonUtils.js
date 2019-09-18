import { request } from "./config";

export const pingServer = () => {
	return request.post("/ping");
}

export const addZero = (i) => {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

export const millisecondConverter = (ms) => {
	let seconds = Math.floor(ms/1000);
	let minutes = Math.floor(seconds/60);
	let hours = Math.floor(minutes/60);

	minutes = minutes-(hours*60);
	seconds = seconds-(hours*60*60)-(minutes*60);

	return {
		seconds,
		minutes,
		hours
	}
}

export const formatDate = (date) => {
	const dateObj = new Date(date);

	let formatted =
		addZero(dateObj.getDate()) + "."
		+ addZero(dateObj.getMonth() + 1) + "."
		+ addZero(dateObj.getFullYear()) + " ";

	formatted +=
		addZero(dateObj.getHours()) + ":"
		+ addZero(dateObj.getMinutes());

	return formatted;
}

export const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
}

export const getMonthName = (month) => {
	const months = [
		"Janvāris",
		"Februāris",
		"Marts",
		"Aprīlis",
		"Maijs",
		"Jūnijs",
		"Jūlijs",
		"Augusts",
		"Septembris",
		"Oktobris",
		"Novembris",
		"Decembris"
	];

	return months[month];
}

export const isWeekend = (date) => {
	const day = date.getDay();
	return ((day === 5) || (day === 6));
}

export const convertSpecialCharacters = (string) => {
	const special = ["Ā", "Č", "Ē", "Ģ", "Ī", "Ķ", "Ļ", "Ņ", "Š", "Ū", "Ž"];
	const normal = ["A", "C", "E", "G", "I", "K", "L", "N", "S", "U", "Z"];

	let output = "";
	for (let i = 0; i < string.length; i++) {
		const letter = string.toUpperCase().charAt(i);
		if(special.indexOf(letter) !== -1) {
			output += normal[special.indexOf(letter)]; 
		} else {
			output += letter;
		}
	}
	return output;
}

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
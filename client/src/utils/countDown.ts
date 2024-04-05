export function countDown(dateTime: Date) {
	const timeRemaining = (dateTime.getTime() - new Date().getTime()) / 1000
	const date = new Date(0)
	date.setSeconds(timeRemaining)
	return date.toISOString().substring(11, 19)
}

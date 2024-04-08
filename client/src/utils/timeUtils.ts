
const timeUtils = {
	isTimeWithinOneHour(dateTime: Date) {
		const currentDateTime = new Date()
		const oneHourMiliSeconds = 60 * 60 * 1000
		const offset = dateTime.getTime() - currentDateTime.getTime()
		return offset > 0 && offset < oneHourMiliSeconds
	},
	isOnTimeExam(examDate: Date, examTime: number) {
		const currentDateTime = new Date()
		const examEndTime = examDate.getTime() + examTime * 60 * 1000
		return examDate.getTime() < currentDateTime.getTime()
			&& currentDateTime.getTime() < examEndTime
	}
}

export default timeUtils

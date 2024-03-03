export type Course = {
	id: number
	teacherId: number
	subjectId: number
	semesterId: number
	shortcode: string
	name: string
}

export type QueryCourseType = {
	semesterId?: number
	search?: string
}

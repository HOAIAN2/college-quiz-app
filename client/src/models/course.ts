import { EnrollmentDetail } from './enrollment'

export type Course = {
	id: number
	teacherId: number
	subjectId: number
	semesterId: number
	shortcode: string
	name: string
}

export type CourseDetail = Course & {
	enrollments: EnrollmentDetail[]
}

export type QueryCourseType = {
	semesterId?: number
	search?: string
}

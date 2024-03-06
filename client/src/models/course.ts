import { EnrollmentDetail } from './enrollment'
import { Subject } from './subject'
import { User } from './user'

export type Course = {
	id: number
	teacherId: number
	subjectId: number
	semesterId: number
	shortcode: string
	name: string
}

export type CourseDetail = Course & {
	teacher: User
	subject: Subject
	enrollments: EnrollmentDetail[]
}

export type QueryCourseType = {
	semesterId?: number
	search?: string
}

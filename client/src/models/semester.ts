import { Course } from './course'

export type Semester = {
	id: number
	startDate: string
	endDate: string
}

export type SemesterDetail = Semester & {
	courses: Course[]
}

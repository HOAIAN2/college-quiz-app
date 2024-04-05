import { Course } from './course'
import { Subject } from './subject'

export type Exam = {
	id: number
	courseId: number
	name: string
	examDate: string
	examTime: number
	createdAt: string
	updatedAt: string
}

export type ExamDetail = Exam & {
	questionsCount: number
	course: Course & {
		subject: Subject
	}
}

export type QueryExamType = {
	step?: string
}

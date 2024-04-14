import { Course } from './course'
import { Subject } from './subject'
import { UserDetail } from './user'

export type Exam = {
	id: number
	courseId: number
	name: string
	examDate: string
	examTime: number
	startedAt: string | null
	canceledAt: string | null
	createdAt: string
	updatedAt: string
}

export type ExamInMonth = Exam & {
	// questionsCount: number
	course: Course & {
		subject: Subject
	}
}

export type ExamDetail = Exam & {
	questionsCount: number
	examSupervisors: {
		id: number
		examId: number
		userId: number
		createdAt: string
		updatedAt: string
		user: UserDetail
	}[]
}

export type QueryExamType = {
	month?: string
	year?: string
}

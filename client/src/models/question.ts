type QuestionLevel = 'easy' | 'medium' | 'hard' | 'expert'

export type Question = {
	id: number
	createdBy?: number | null
	subjectId: number
	chapterId?: number | null
	level: QuestionLevel
	content: string
}

export type QueryQuestionType = {
	subjectId: string | number
	chapterId: string | number
	search?: string
}

export type QuestionOption = {
	id: number
	question_id: number
	content: string
	is_correct: boolean
}

export type QuestionDetail = Question & {
	questionOptions: QuestionOption[]
}

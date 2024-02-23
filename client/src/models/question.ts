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

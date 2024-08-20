type QuestionLevel = 'easy' | 'medium' | 'hard' | 'expert';

export type Question = {
	id: number;
	createdBy: number | null;
	lastUpdatedBy: number | null;
	subjectId: number;
	chapterId?: number | null;
	level: QuestionLevel;
	content: string;
	createdAt: string;
	updatedAt: string;
};

export type QueryQuestionType = {
	subjectId: string | number;
	chapterId: string | number | null;
	search?: string;
};

export type QuestionOption = {
	id: number;
	questionId: number;
	content: string;
	isCorrect: boolean;
};

export type QuestionDetail = Question & {
	questionOptions: QuestionOption[];
};

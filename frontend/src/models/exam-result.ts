import { QuestionOption } from './question';
import { User } from './user';

export type ExamResult = {
    id: number;
    examId: number;
    userId: number;
    correctCount: number;
    questionCount: number;
    ip: string;
    userAgent: string;
    cancelledAt: string | null;
    cancellationReason: string | null;
    cancelledByUserId: number | null,
    remarkByUserId: number | null,
    createdAt: string;
    updatedAt: string;
};

export type ExamResultWithAnswers = {
    examResult: ExamResult & {
        user: User;
    };
    examQuestionsAnswers: ExamQuestionsAnswer[];
};

type ExamQuestionsAnswer = {
    id: number;
    userId: number;
    examId: number;
    questionId: number;
    answerId: number | null;
    isCorrect: boolean;
    examQuestion: ExamQuestion;
};

type ExamQuestion = {
    id: number;
    examId: number;
    questionId: number;
    question: Question;
};

type Question = {
    id: number;
    content: string;
    questionOptions: QuestionOption[];
};
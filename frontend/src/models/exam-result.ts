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
    createdAt: string | null;
    updatedAt: string | null;
};

export type ExamResultWithUser = {
    id: number;
    examId: number;
    userId: number;
    correctCount: number;
    questionCount: number;
    ip: string;
    userAgent: string;
    cancelledAt: string | null;
    cancellationReason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    user: User;
};

export type ExamResultWithAnswers = {
    examResult: ExamResultWithUser;
    examQuestionsAnswers: ExamQuestionsAnswer[];
};

type ExamQuestionsAnswer = {
    id: number;
    userId: number;
    examId: number;
    questionId: number;
    answerId: number;
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
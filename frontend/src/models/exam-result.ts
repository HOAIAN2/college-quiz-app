import { Exam } from './exam';
import { QuestionOption } from './question';
import { User } from './user';

export type ExamDetail = {
    exam: Exam;
    result: {
        id: number | null;
        studentId: number;
        firstName: string;
        lastName: string;
        schoolClassShortcode: string;
        gender: 'male' | 'female';
        questionCount: number;
        correctCount: number | null;
        submittedAt: string | null;
        remarked: boolean;
        cancelled: false;
    }[];
};

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
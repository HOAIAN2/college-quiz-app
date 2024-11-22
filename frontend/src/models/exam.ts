import { Course } from './course';
import { Subject } from './subject';
import { User } from './user';

export type Exam = {
    id: number;
    courseId: number;
    name: string;
    examDate: string;
    examTime: number;
    startedAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ExamInMonth = Exam & {
    course: Course & {
        subject: Subject;
    };
};

export type ExamDetail = Exam & {
    questionsCount: number;
    result: {
        studentId: number;
        firstName: string;
        lastName: string;
        schoolClassShortcode: string;
        gender: 'male' | 'female';
        questionCount: number;
        correctCount: number | null;
        submittedAt: string | null;
    }[];
    examSupervisors: {
        id: number;
        examId: number;
        userId: number;
        createdAt: string;
        updatedAt: string;
        user: User;
    }[];
};

export type ExamWithQuestion = {
    examData: Exam & {
        questions: ExamQuestion[];
    };
    answersCache: number[] | null;
};

export type QueryExamType = {
    month?: string;
    year?: string;
};

export type ExamQuestion = {
    id: number;
    content: string;
    pivot: Pivot;
    questionOptions: QuestionOption[];
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

type Pivot = {
    examId: number;
    questionId: number;
    id: number;
    createdAt: string;
    updatedAt: string;
};

type QuestionOption = {
    id: number;
    questionId: number;
    content: string;
};

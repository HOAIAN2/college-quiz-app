import { EnrollmentDetail } from './enrollment';
import { Exam } from './exam';
import { Subject } from './subject';
import { User } from './user';

export type Course = {
	id: number;
	teacherId: number;
	subjectId: number;
	semesterId: number;
	shortcode: string;
	name: string;
};

export type CourseDetail = Course & {
	teacher: User;
	subject: Subject;
	enrollments: EnrollmentDetail[];
	exams: (Exam & {
		questionsCount: number;
	})[];
};

export type QueryCourseType = {
	semesterId?: number;
	search?: string;
};

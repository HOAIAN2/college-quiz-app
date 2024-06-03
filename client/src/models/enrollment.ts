import { UserDetail } from './user';

export type Enrollment = {
	id: number,
	courseId: number,
	studentId: number,
};

export type EnrollmentDetail = Enrollment & {
	user: UserDetail;
};

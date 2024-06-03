import { Course } from './course';

export type Semester = {
	id: number;
	name: string;
	startDate: string;
	endDate: string;
};

export type SemesterDetail = Semester & {
	courses: Course[];
};

export type QuerySemesterType = {
	page?: number;
	perPage?: number;
	search?: string;
};

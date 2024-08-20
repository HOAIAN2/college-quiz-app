import { Exam } from './exam';

export type DashboarData = {
	numberOfTeachers: number;
	numberOfStudents: number;
	numberOfCourses: number;
	examsInThisMonth: number;
	examsEachMonth: number[];
	todayExams: Exam[];
};

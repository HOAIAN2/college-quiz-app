import { Faculty } from './faculty';

export type SchoolClass = {
	id: number;
	shortcode: string;
	name: string;
	facultyId: number;
	createdAt: string;
	updatedAt: string;
};

export type SchoolClassDetail = SchoolClass & {
	faculty: Faculty;
};
export type QuerySchoolClassType = {
	page?: number;
	perPage?: number;
	search?: string;
};

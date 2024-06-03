import { User } from './user';

export type Faculty = {
	id: number;
	shortcode: string;
	name: string;
	email: string | null;
	phoneNumber: string;
	leaderId: number | null;
	createdAt: string;
	updatedAt: string;
};

export type FacultyDetail = Faculty & {
	leader: User | null;
};

export type QueryFacultyType = {
	page?: number;
	perPage?: number;
	search?: string;
};

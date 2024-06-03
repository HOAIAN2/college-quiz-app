import { Faculty } from './faculty';
import { Role, RoleName } from './role';
import { SchoolClass } from './school-class';

export type User = {
	id: number;
	roleId: number;
	shortcode: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string | null;
	gender: 'male' | 'female';
	address: string;
	birthDate: string;
	schoolClassId: number | null;
	facultyId: number | null;
	isActive: boolean;
	emailVerifiedAt: string | null;
};

export type UserDetail = User & {
	role: Role;
	schoolClass: SchoolClass | null;
	faculty: Faculty | null;
};

export type UserWithPermissions = {
	user: UserDetail;
	permissions: string[];
};

export type QueryUserType = {
	role: RoleName;
	page?: number;
	perPage?: number;
	search?: string;
};

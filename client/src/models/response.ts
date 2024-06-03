import { Permission } from './permission';
import { RoleWithPermissions } from './role';
import { UserDetail } from './user';

export type ApiResponseWithData<T> = {
	status: 'success' | 'fail';
	data: T;
	message?: string;
};

export type LoginResponse = {
	user: UserDetail;
	token: string;
};

export type RolePermissionsResponse = {
	role: RoleWithPermissions;
	appPermissions: Array<Permission & { displayName: string; }>;
};

export type ExportableResponse = {
	fieldName: string;
	field: string;
};

export type Pagination<T> = {
	currentPage: number;
	data: T[];
	firstPageUrl: string;
	from: number;
	lastPage: number;
	lastPageUrl: string;
	links: Link[];
	nextPageUrl: string | null;
	path: string;
	perPage: number;
	prevPageUrl: string | null;
	to: number;
	total: number;
};

export type Link = {
	url?: string;
	label: string;
	active: boolean;
};

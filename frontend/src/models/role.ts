import { PermissionWithPivot } from './permission';

export type RoleName = 'student' | 'teacher' | 'admin';

export type Role = {
	id: number;
	name: RoleName;
};

export type RoleWithDisplayName = Role & {
	displayName: string;
};

export type RoleWithPermissionCount = RoleWithDisplayName & {
	permissionsCount: number;
};

export type RoleWithPermissionNames = Role & {
	permissions: string[];
};

export type RoleWithPermissions = Role & {
	permissions: PermissionWithPivot[];
};

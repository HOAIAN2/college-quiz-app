export type Permission = {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
};
export type PermissionWithPivot = Permission & {
	pivot: Pivot;
};

type Pivot = {
	roleId: number;
	permissionId: number;
	createdAt: number;
	updatedAt: number;
};

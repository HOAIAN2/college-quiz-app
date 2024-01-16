export type RoleName = 'student' | 'teacher' | 'admin'

export type Role = {
    id: number;
    name: RoleName;
}

export type RoleWithPermissionCount = Role & {
    permissionsCount: number
}

export type RoleWithPermissions = Role & {
    permissions: string[]
}
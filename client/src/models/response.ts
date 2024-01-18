import { Permission } from './permission'
import { RoleWithPermissions } from './role'
import { User } from './user'

export type ApiResponseWithData<T> = {
    status: 'success' | 'fail'
    data: T
    message?: string
}

export type LoginResponse = {
    user: User
    token: string
}

export type RolePermissionsResponse = {
    role: RoleWithPermissions
    appPermissions: Permission & {
        displayName: string
    }
}

export type ExportableResponse = {
    fieldName: string
    field: string
}
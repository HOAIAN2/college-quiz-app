import { SchoolClass } from './class'
import { Faculty } from './faculty'
import { Role, RoleName } from './role'

export type User = {
    id: number
    roleId: number
    shortcode: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string | null
    gender: 'male' | 'female'
    address: string
    birthDate: string
    schoolClassId: number | null
    facultyId: number | null
    isActive: boolean
    emailVerifiedAt: string | null
    role: Role
    schoolClass: SchoolClass | null
    faculty: Faculty | null
}

export type UserWithPermissions = {
    user: User
    permissions: string[]
}

export type QueryUserType = {
    role: RoleName
    page?: number
    perPage?: number,
    search?: string
}
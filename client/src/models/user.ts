import { SchoolClass } from './class'
import { Faculty } from './faculty'

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

export type RoleName = 'student' | 'teacher' | 'admin'

export type Role = {
    id: number;
    name: RoleName;
    displayName: string;
}
export type UserPagination = {
    currentPage: number
    data: User[]
    firstPageUrl: string
    from: number
    lastPage: number
    lastPageUrl: string
    links: Link[]
    nextPageUrl: string | null
    path: string
    perPage: number
    prevPageUrl: string | null
    to: number
    total: number
}

export type Link = {
    url?: string
    label: string
    active: boolean
}

export type QueryUserType = {
    role: RoleName
    page?: number
    perPage?: 10 | 20 | 30 | 40 | 50,
    search?: string
}
import { Course } from "./course";

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
    schoolClassId: string | null;
    facultyId: string | null;
    isActive: boolean;
    emailVerifiedAt: Date | null;
    role: Role;
}
export type UserDetail = {
    user: User
    course: Course[]
}

export type RoleName = 'student' | 'teacher' | 'admin'

export type Role = {
    id: number;
    name: RoleName;
    displayName: string;
}
export interface UserPagination {
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

export interface Link {
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
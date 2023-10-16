export type LoginResponse = {
    user: User;
    token: string;
}

export type User = {
    id: number;
    roleId: number;
    shortcode: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    gender: string;
    address: string;
    birthDate: Date;
    class: string | null;
    faculty: string | null;
    isActive: boolean;
    emailVerifiedAt: Date | null;
    role: Role;
}

export type Role = {
    id: number;
    name: string;
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

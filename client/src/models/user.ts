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
    phoneNumber: null;
    gender: string;
    address: string;
    birthDate: Date;
    class: null;
    isActive: boolean;
    emailVerifiedAt: null;
    role: Role;
}

export type Role = {
    id: number;
    name: string;
    displayName: string;
}

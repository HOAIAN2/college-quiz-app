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
    isActive: boolean;
    emailVerifiedAt: Date | null;
    role: Role;
}

export type Role = {
    id: number;
    name: string;
    displayName: string;
}

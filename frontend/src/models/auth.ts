export type PersonalAccessToken = {
    id: number;
    tokenableId: number;
    name: string;
    ip: string | null;
    userAgent: string | null;
    abilities: string[];
    lastUsedAt: string;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
};

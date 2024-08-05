export type PersonalAccessToken = {
	id: number;
	tokenableId: number;
	name: {
		ip: string;
		userAgent: string;
	};
	abilities: string[];
	lastUsedAt: string;
	expiresAt: string | null;
	createdAt: string;
	updatedAt: string;
};

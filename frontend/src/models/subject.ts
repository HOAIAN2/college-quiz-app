import { Chapter } from './chapter';

export type Subject = {
	id: number;
	shortcode: string;
	name: string;
};
export type SubjectDetail = Subject & {
	chapters: (Chapter & {
		questionsCount: number;
	})[];
};

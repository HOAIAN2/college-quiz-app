import { Chapter } from './chapter'

export type Subject = {
	id: number
	shortcode: string
	name: string
}
export type SubjectDetail = Subject & {
	chapters: Chapter[]
}
export type QuerySubjectType = {
	page?: number
	perPage?: number,
	search?: string
}

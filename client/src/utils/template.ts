import { API_HOST } from '../config/env';

type TemplateFileUrl = {
	[key: string]: string;
};

export const importTemplateFileUrl = {
	student: API_HOST + '/data/Import_Student_Template.xlsx',
	teacher: API_HOST + '/data/Import_Teacher_Template.xlsx',
} as TemplateFileUrl;

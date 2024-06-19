import { API_HOST } from '../config/env';

export const importTemplateFileUrl = {
	admin: '',
	student: API_HOST + '/data/Import_Student_Template.xlsx',
	teacher: API_HOST + '/data/Import_Teacher_Template.xlsx',
};

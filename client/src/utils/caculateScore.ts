import { BASE_SCORE_SCALE } from '../config/env';
import languageUtils from './languageUtils';

export default function caculateScore(correctCount: number, questionCount: number) {
	languageUtils.getLanguage();
	return Number((correctCount / questionCount * BASE_SCORE_SCALE)
		.toFixed(2))
		.toLocaleString(languageUtils.getLanguage(), {
			notation: 'compact'
		}) + `/${BASE_SCORE_SCALE}`;
}

import { BASE_SCORE_SCALE } from '../config/env';
import languageUtils from './language-utils';

export default function caculateScore(correctCount: number, questionCount: number) {
    languageUtils.getLanguage();
    const score = isNaN(correctCount / questionCount) ? 0 : correctCount / questionCount;
    return Number((score * BASE_SCORE_SCALE)
        .toFixed(2))
        .toLocaleString(languageUtils.getLanguage()) + `/${BASE_SCORE_SCALE}`;
}

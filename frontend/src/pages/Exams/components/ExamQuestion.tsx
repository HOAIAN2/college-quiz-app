import styles from '../styles/ExamQuestion.module.css';

import { useState } from 'react';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import useLanguage from '~hooks/useLanguage';
import { ExamQuestion as TExamQuestion } from '~models/exam';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';

type ExamQuestionProps = {
    index: number;
    question: TExamQuestion;
    answerIndex: number;
    setAnswers: React.Dispatch<React.SetStateAction<number[]>>;
};
export default function ExamQuestion({
    index,
    question,
    answerIndex,
    setAnswers
}: ExamQuestionProps) {
    const [checkedIndex, setCheckedIndex] = useState(answerIndex);
    const language = useLanguage('component.exam_question');
    return (
        <div className={styles.examQuestionContainer}>
            <span className={styles.questionContent}>
                {language?.question} {index + 1}. {question.content}
            </span>
            {
                question.questionOptions.map((option, i) => {
                    return (
                        <div
                            onClick={() => {
                                setCheckedIndex(i);
                                setAnswers(pre => {
                                    pre[index] = i;
                                    return structuredClone(pre);
                                });
                            }}
                            className={
                                css(
                                    styles.questionOptionContainer,
                                    checkedIndex === i ? styles.checked : ''
                                )
                            }
                            key={`exam-question-option-${option.id}`}
                        >
                            {
                                checkedIndex === i ? <MdOutlineRadioButtonChecked />
                                    : <MdOutlineRadioButtonUnchecked />
                            }
                            <span className={styles.questionOption}>
                                {languageUtils.getLetterFromIndex(i)}. {option.content}
                            </span>
                        </div>
                    );
                })
            }
        </div>
    );
}

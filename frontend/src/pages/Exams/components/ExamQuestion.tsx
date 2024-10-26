import styles from '../styles/ExamQuestion.module.css';

import React, { useState } from 'react';
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
            <p className={styles.questionContent}
                dangerouslySetInnerHTML={{
                    __html: `<span>${language?.question} ${index + 1}.</span> ${question.content}`
                }}>
            </p>
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
                                checkedIndex === i ?
                                    <>
                                        <MdOutlineRadioButtonChecked />
                                        <span style={{ fontSize: '16px' }}>
                                            {languageUtils.getLetterFromIndex(i)}.
                                        </span>
                                    </>
                                    : <>
                                        <MdOutlineRadioButtonUnchecked />
                                        <span style={{ fontSize: '16px' }}>
                                            {languageUtils.getLetterFromIndex(i)}.
                                        </span>
                                    </>
                            }
                            <p className={styles.questionOption}
                                dangerouslySetInnerHTML={{
                                    __html: `${option.content}`
                                }}>
                            </p>
                        </div>
                    );
                })
            }
        </div>
    );
}

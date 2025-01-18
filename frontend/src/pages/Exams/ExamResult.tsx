import appStyles from '~styles/App.module.css';
import styles from './styles/ExamResult.module.css';

import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';
import { apiGetExamResult } from '~api/exam-result';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import caculateScore from '~utils/caculateScore';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';

function ExamResult() {
    const { permissions, appLanguage } = useAppContext();
    const language = useLanguage('page.exam_result');
    const { resultId } = useParams();
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM_RESULT, { id: resultId }],
        queryFn: () => apiGetExamResult(String(resultId)),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
    if (!permissions.has('exam_result_view')) return <Navigate to='/' />;
    return (
        <>
            <main className={css(appStyles.dashboard, styles.examResultContainer)}>
                {
                    queryData.isLoading ? <Loading /> : null
                }
                {
                    queryData.data ?
                        <>
                            <section>
                                <h2>{language?.result}</h2>
                                <div>{language?.numberOfCorrectAnswers}: {queryData.data.examResult.correctCount}</div>
                                <div>{language?.numberOfQuestion}: {queryData.data.examResult.questionCount}</div>
                                <div>{language?.score}: {caculateScore(queryData.data.examResult.correctCount, queryData.data.examResult.questionCount)}</div>
                                <div>{language?.submittedAt}: {new Date(queryData.data.examResult.createdAt).toLocaleString(appLanguage.language)}</div>
                            </section>
                            <section>
                                <div className={styles.questionsContainer}>
                                    {
                                        queryData.data.examQuestionsAnswers.map((answer, index) => {
                                            const selectAnswer = answer.examQuestion.question.questionOptions.findIndex(option => option.id === answer.answerId);
                                            const correctAnswer = answer.examQuestion.question.questionOptions.findIndex(option => option.isCorrect);
                                            return (
                                                <div key={answer.id}
                                                    className={styles.examQuestionContainer}
                                                >
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: `<span>${language?.question} ${index + 1}. ${answer.examQuestion.question.content}</span>`
                                                        }}>
                                                    </div>
                                                    {
                                                        answer.examQuestion.question.questionOptions.map((option, i) => {
                                                            return (
                                                                <div key={option.id}
                                                                    className={styles.questionOptionContainer}
                                                                >
                                                                    <div>{languageUtils.getLetterFromIndex(i)}.</div>
                                                                    <p dangerouslySetInnerHTML={{ __html: option.content }}></p>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                    <br />
                                                    <div>{language?.result}: {
                                                        answer.isCorrect ?
                                                            <span style={{ fontWeight: 'bold', color: 'var(--color-green)' }}>{language?.right}</span>
                                                            : <span style={{ fontWeight: 'bold', color: 'var(--color-red)' }}>{language?.wrong}</span>}
                                                    </div>
                                                    <div>{language?.choosenAnswer}: {languageUtils.getLetterFromIndex(selectAnswer)}</div>
                                                    <div>{language?.correctAnswer}: {languageUtils.getLetterFromIndex(correctAnswer)}</div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </section>
                            <section>
                                <div className={styles.actionItems}>
                                    <button
                                        className={appStyles.actionItem}>
                                        {language?.remark}
                                    </button>
                                    <button
                                        className={appStyles.actionItemWhiteBorderRed}>
                                        {language?.cancel}
                                    </button>
                                </div>
                            </section>
                        </> : null
                }
            </main>
        </>
    );
}

export default ExamResult;
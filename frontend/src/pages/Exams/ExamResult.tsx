import appStyles from '~styles/App.module.css';
import styles from './styles/ExamResult.module.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { apiGetExamById } from '~api/exam';
import { apiGetExamResult } from '~api/exam-result';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import NotFound from '~pages/Errors/NotFound';
import caculateScore from '~utils/caculate-score';
import css from '~utils/css';
import languageUtils from '~utils/language-utils';
import ExamActionPopUp from './components/ExamActionPopUp';

function ExamResult() {
    const [showActionPopUp, setShowActionPopUp] = useState(false);
    const [action, setAction] = useState<'cancel' | 'remark'>('cancel');
    const { permissions, appLanguage, appTitle } = useAppContext();
    const language = useLanguage('page.exam_result');
    const queryClient = useQueryClient();
    const { id, resultId } = useParams();
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM_RESULT, { id: resultId }],
        queryFn: () => apiGetExamResult(String(resultId)),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
    const examQueryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM, { id: id }],
        queryFn: () => apiGetExamById(String(id)),
        refetchOnWindowFocus: false,
        enabled: permissions.has('exam_view'),
        retry: false,
    });
    const durationFormat = languageUtils.createDurationFormatter(appLanguage.language);
    const onMutateSuccess = () => {
        queryClient.refetchQueries({ queryKey: [QUERY_KEYS.EXAM_RESULT, { id: resultId }] });
        queryClient.removeQueries({ queryKey: [QUERY_KEYS.EXAM_RESULTS, { examId: id }] });
    };
    useEffect(() => {
        if (language) appTitle.setAppTitle(language.examResult);
    }, [appTitle, language]);
    if (queryData.data && String(queryData.data.examResult.examId) != id) return (
        <main className={css(appStyles.dashboard, styles.examResultContainer)}>
            <NotFound />
        </main>
    );
    if (!permissions.has('exam_result_view')) return <Navigate to='/' />;
    return (
        <>
            {
                showActionPopUp ?
                    <ExamActionPopUp
                        action={action}
                        examResultId={String(resultId)}
                        setShowPopUp={setShowActionPopUp}
                        onMutateSuccess={onMutateSuccess}
                    /> : null
            }
            <main className={css(appStyles.dashboard, styles.examResultContainer)}>
                {
                    queryData.isLoading || examQueryData.isLoading ? <Loading /> : null
                }
                {
                    queryData.data && examQueryData.data ?
                        <>
                            <section>
                                <h2>{language?.examResult}</h2>
                                <p>{language?.examName}: {examQueryData.data.name}</p>
                                <p>{language?.examTime}: {durationFormat(examQueryData.data.examTime)}</p>
                                <br />
                                <p>{language?.studentName}: {languageUtils.getFullName(queryData.data.examResult.user.firstName, queryData.data.examResult.user.lastName)}</p>
                                <p>{language?.numberOfCorrectAnswers}: {queryData.data.examResult.correctCount}</p>
                                <p>{language?.numberOfQuestion}: {queryData.data.examResult.questionCount}</p>
                                <p>{language?.score}: {caculateScore(queryData.data.examResult.correctCount, queryData.data.examResult.questionCount)}</p>
                                <p>{language?.submittedAt}: {new Date(queryData.data.examResult.createdAt).toLocaleString(appLanguage.language)}</p>
                                <br />
                                {
                                    queryData.data.examResult.remarkByUserId
                                        ? <p>{language?.remarked}</p> : null
                                }
                                {
                                    queryData.data.examResult.cancelledByUserId ?
                                        <>
                                            <p style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>{language?.cancelled}</p>
                                            <p>{language?.cancellationReason}: {queryData.data.examResult.cancellationReason}</p>
                                        </> : null
                                }
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
                                                            <span style={{ fontWeight: 'bold', color: 'var(--color-soft-green)' }}>{language?.right}</span>
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
                            {
                                permissions.hasAnyFormList(['exam_result_remark', 'exam_result_cancel']) ?
                                    <section>
                                        <div className={styles.actionItems}>
                                            {
                                                permissions.has('exam_result_remark') && queryData.data.examResult.cancelledByUserId === null ?
                                                    <button
                                                        className={appStyles.actionItem}
                                                        onClick={() => {
                                                            setAction('remark');
                                                            setShowActionPopUp(true);
                                                        }}
                                                    >
                                                        {language?.remark}
                                                    </button> : null
                                            }
                                            {
                                                permissions.has('exam_result_cancel') && queryData.data.examResult.cancelledByUserId === null ?
                                                    <button
                                                        className={appStyles.actionItemWhiteBorderRed}
                                                        onClick={() => {
                                                            setAction('cancel');
                                                            setShowActionPopUp(true);
                                                        }}
                                                    >
                                                        {language?.cancel}
                                                    </button> : null
                                            }
                                        </div>
                                    </section>
                                    : null
                            }
                        </> : null
                }
            </main>
        </>
    );
}

export default ExamResult;

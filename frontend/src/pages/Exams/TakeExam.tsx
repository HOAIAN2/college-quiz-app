import appStyles from '~styles/App.module.css';
import styles from './styles/TakeExam.module.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sha256 } from 'js-sha256';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbSend } from 'react-icons/tb';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { apiGetTakeExam, apiSubmitExam, apiSyncExamAnswersCache } from '~api/exam';
import Loading from '~components/Loading';
import ScorePopUp from '~components/ScorePopUp';
import YesNoPopUp from '~components/YesNoPopUp';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useForceUpdate from '~hooks/useForceUpdate';
import useLanguage from '~hooks/useLanguage';
import { ExamResult } from '~models/exam';
import timeUtils from '~utils/timeUtils';
import ExamQuestion from './components/ExamQuestion';

export default function TakeExam() {
    const { id } = useParams();
    const { appTitle } = useAppContext();
    const [showSubmitPopUp, setShowSubmitPopUp] = useState(false);
    const [examResult, setExamResult] = useState<ExamResult>();
    const [bypassKey, setBypassKey] = useState('');
    const queryClient = useQueryClient();
    const requestRef = useRef<number>();
    const [answers, setAnswers] = useState<number[]>([]);
    const language = useLanguage('page.take_exam');
    const forceUpdate = useForceUpdate();
    const animate = useCallback(() => {
        forceUpdate();
        requestRef.current = requestAnimationFrame(animate);
    }, [forceUpdate]);
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM_QUESTIONS, { examId: id }],
        queryFn: () => apiGetTakeExam(String(id)),
        enabled: examResult === undefined,
        staleTime: Infinity,
        retry: 0
    });
    useEffect(() => {
        if (answers.length === 0) return;
        apiSyncExamAnswersCache(String(id), answers);
    }, [answers, id]);
    const timeLeft = queryData.data ?
        timeUtils.countDown(new Date(Date.parse(queryData.data.examData.startedAt!) + queryData.data.examData.examTime * 60000)) : '';
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => apiSubmitExam(String(id), answers, bypassKey),
        onSuccess: (data) => {
            setExamResult(data);
        },
    });
    useEffect(() => {
        if (examResult) return;
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [animate, examResult]);
    useEffect(() => {
        if (!queryData.data) return;
        setBypassKey(sha256(queryData.data.examData.startedAt!));
    }, [queryData.data]);
    useEffect(() => {
        if (!queryData.data) return;
        const endAt = new Date(queryData.data.examData.startedAt!).getTime() + (queryData.data.examData.examTime * 60 * 1000);
        const now = new Date().getTime();
        if (now > endAt && !isPending && !examResult) {
            mutateAsync();
            toast.info(language?.autoSubmitInfo);
        }
    });
    useEffect(() => {
        if (!queryData.data) return;
        appTitle.setAppTitle(queryData.data.examData.name);
        const newAnswers = Array(queryData.data.examData.questions.length).fill(-1);
        if (queryData.data.answersCache) {
            setAnswers(queryData.data.answersCache);
        }
        else if (answers.length !== newAnswers.length) {
            setAnswers(newAnswers);
        }
    }, [answers.length, appTitle, queryData.data]);
    useEffect(() => {
        if (!queryData.data) return;
        return () => {
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.EXAM, { id: id }] });
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.EXAM_QUESTIONS, { examId: id }] });
        };
    }, [id, queryClient, queryData.data]);
    if (queryData.isError) return <Navigate to={`/exams/${id}`} />;
    return (
        <>
            {examResult ?
                <ScorePopUp
                    data={examResult}
                    backURL={`/exams/${id}`}
                /> : null
            }
            {showSubmitPopUp ?
                <YesNoPopUp
                    mutateFunction={mutateAsync}
                    setShowPopUp={setShowSubmitPopUp}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                    message={language?.submitMessage.replace('@time', timeLeft) || ''}
                    onMutateSuccess={() => { }}
                /> : null
            }
            {
                queryData.isLoading ? < Loading /> : null
            }
            {
                queryData.data
                    && answers.length === queryData.data.examData.questions.length ?
                    <>
                        <main className={styles['take-exam-container']}>
                            <div className={styles['data-container']}>
                                <div className={styles['title']}>
                                    <div>
                                        {queryData.data.examData.name}
                                    </div>
                                    <div>
                                        {language?.timeLeft}: {timeLeft}
                                    </div>
                                </div>
                                <div className={styles['questions-container']}>
                                    {
                                        queryData.data.examData.questions.map((question, index) => {
                                            return (
                                                <ExamQuestion
                                                    key={`exam-question-${question.id}`}
                                                    index={index}
                                                    question={question}
                                                    answerIndex={answers[index]}
                                                    setAnswers={setAnswers}
                                                />
                                            );
                                        })
                                    }
                                </div>
                                {language?.numberOfQuestionsAnswered}: {answers.filter(i => i !== -1).length}/{answers.length}
                                <div className={styles['action-items']}>
                                    <button
                                        onClick={() => { setShowSubmitPopUp(true); }}
                                        className={appStyles['action-item-d']}>
                                        <TbSend /> {language?.submit}
                                    </button>
                                </div>
                            </div>
                        </main>
                    </> : null
            }
        </>
    );
}

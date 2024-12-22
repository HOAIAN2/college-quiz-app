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
    const [timeLeft, setTimeLeft] = useState('');
    const queryClient = useQueryClient();
    const requestRef = useRef<number>(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const language = useLanguage('page.take_exam');
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
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => apiSubmitExam(String(id), answers, bypassKey),
        onSuccess: (data) => {
            setExamResult(data);
        },
    });
    const animate = useCallback(() => {
        if (!queryData.data) return;
        const newTimeLeft = timeUtils.countDown(new Date(Date.parse(queryData.data.examData.startedAt!)
            + queryData.data.examData.examTime * 60000));
        setTimeLeft(newTimeLeft);
        requestRef.current = requestAnimationFrame(animate);
        // Auto submit
        const endAt = new Date(queryData.data.examData.startedAt!).getTime() + (queryData.data.examData.examTime * 60 * 1000);
        const now = new Date().getTime();
        if (now > endAt && !isPending && !examResult) {
            mutateAsync();
            toast.info(language?.autoSubmitInfo);
        }
    }, [examResult, isPending, language?.autoSubmitInfo, mutateAsync, queryData.data]);
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
    useEffect(() => {
        const handleVisibilityStateChange = () => {
            if (document.visibilityState === 'hidden') {
                console.log('Document hidden');
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityStateChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityStateChange);
        };
    }, []);
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
                        <main className={styles.takeExamContainer}>
                            <div className={styles.dataContainer}>
                                <div className={styles.title}>
                                    <div>
                                        {queryData.data.examData.name}
                                    </div>
                                    <div>
                                        {language?.timeLeft}: {timeLeft}
                                    </div>
                                </div>
                                <div className={styles.questionsContainer}>
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
                                <div className={styles.actionItems}>
                                    <button
                                        onClick={() => { setShowSubmitPopUp(true); }}
                                        className={appStyles.actionItem}>
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

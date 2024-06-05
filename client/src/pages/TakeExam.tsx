import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sha256 } from 'js-sha256';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbSend } from 'react-icons/tb';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import appStyles from '../App.module.css';
import { apiGetExamQuestions, apiSubmitExam } from '../api/exam';
import ExamQuestion from '../components/ExamQuestion';
import Loading from '../components/Loading';
import ScorePopUp from '../components/ScorePopUp';
import YesNoPopUp from '../components/YesNoPopUp';
import QUERY_KEYS from '../constants/query-keys';
import useForceUpdate from '../hooks/useForceUpdate';
import useLanguage from '../hooks/useLanguage';
import { ExamResult } from '../models/exam';
import styles from '../styles/TakeExam.module.css';
import isValidJson from '../utils/isValidJson';
import timeUtils from '../utils/timeUtils';

export default function TakeExam() {
	const { id } = useParams();
	const localStorageKey = `exam_${id}`;
	const [showSubmitPopUp, setShowSubmitPopUp] = useState(false);
	const [examResult, setExamResult] = useState<ExamResult>();
	const [bypassKey, setBypassKey] = useState('');
	const queryClient = useQueryClient();
	const requestRef = useRef<number>();
	const [answers, setAnswers] = useState<number[]>(() => {
		const data = localStorage.getItem(localStorageKey);
		if (data === null || !isValidJson(data)) {
			localStorage.setItem(localStorageKey, '[]');
			return [];
		}
		const decodedData = JSON.parse(data);
		if (!Array.isArray(decodedData) || decodedData.some(i => !Number.isInteger(i))) {
			localStorage.setItem(localStorageKey, '[]');
			return [];
		}
		return decodedData;
	});
	const language = useLanguage('page.take_exam');
	const forceUpdate = useForceUpdate();
	const animate = useCallback(() => {
		forceUpdate();
		requestRef.current = requestAnimationFrame(animate);
	}, [forceUpdate]);
	const onMutateSuccess = () => {
		localStorage.removeItem(localStorageKey);
	};
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.EXAM_QUESTIONS, { examId: id }],
		queryFn: () => apiGetExamQuestions(String(id)),
		enabled: examResult === undefined,
		staleTime: Infinity
	});
	const timeLeft = queryData.data ?
		timeUtils.countDown(new Date(Date.parse(queryData.data.startedAt!) + queryData.data.examTime * 60000)) : '';
	const { mutateAsync, isPending } = useMutation({
		mutationFn: () => apiSubmitExam(String(id), answers, bypassKey),
		onSuccess: (data) => {
			onMutateSuccess();
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
		setBypassKey(sha256(queryData.data.startedAt!));
	}, [queryData.data]);
	useEffect(() => {
		if (!queryData.data) return;
		const endAt = new Date(queryData.data.startedAt!).getTime() + (queryData.data.examTime * 60 * 1000);
		const now = new Date().getTime();
		if (now > endAt && !isPending && !examResult) {
			mutateAsync();
			toast.info(language?.autoSubmitInfo);
		}
	});
	useEffect(() => {
		if (!queryData.data) return;
		document.title = queryData.data.name;
		const newAnswers = Array(queryData.data.questions.length).fill(-1);
		if (answers.length !== newAnswers.length) {
			setAnswers(newAnswers);
			localStorage.setItem(localStorageKey, JSON.stringify(newAnswers));
		}
		else {
			localStorage.setItem(localStorageKey, JSON.stringify(answers));
		}
		return () => {
			if (answers.length === 0) {
				localStorage.removeItem(localStorageKey);
			}
		};
	}, [answers, id, localStorageKey, queryData.data]);
	useEffect(() => {
		if (!queryData.data) return;
		return () => {
			queryClient.refetchQueries({ queryKey: [QUERY_KEYS.EXAM, { id: id }] });
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.EXAM_QUESTIONS, { examId: id }] });
		};
	}, [id, queryClient, queryData.data]);
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
				queryData.data ?
					<>
						<main className={styles['take-exam-container']}>
							<div className={styles['data-container']}>
								<div className={styles['title']}>
									<div>
										{queryData.data.name}
									</div>
									<div>
										{language?.timeLeft}: {timeLeft}
									</div>
								</div>
								<div className={styles['questions-container']}>
									{
										queryData.data.questions.map((question, index) => {
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

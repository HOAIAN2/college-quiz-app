import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiGetExamQuestions, apiSubmitExam } from '../api/exam'
import ExamQuestion from '../components/ExamQuestion'
import Loading from '../components/Loading'
import ScorePopUp from '../components/ScorePopUp'
import YesNoPopUp from '../components/YesNoPopUp'
import { queryKeys } from '../constants/query-keys'
import useForceUpdate from '../hooks/useForceUpdate'
import useLanguage from '../hooks/useLanguage'
import { PageTakeExamLang } from '../models/lang'
import styles from '../styles/TakeExam.module.css'
import isValidJson from '../utils/isValidJson'
import timeUtils from '../utils/timeUtils'

export default function TakeExam() {
	const { id } = useParams()
	const localStorageKey = `exam_${id}`
	const [showSubmitPopUp, setShowSubmitPopUp] = useState(false)
	const [answers, setAnswers] = useState<number[]>(() => {
		const data = localStorage.getItem(localStorageKey)
		if (data === null || !isValidJson(data)) {
			localStorage.setItem(localStorageKey, '[]')
			return []
		}
		const decodedData = JSON.parse(data)
		if (!Array.isArray(decodedData) || decodedData.some(i => !Number.isInteger(i))) {
			localStorage.setItem(localStorageKey, '[]')
			return []
		}
		return decodedData
	})
	const language = useLanguage<PageTakeExamLang>('page.take_exam')
	const navigate = useNavigate()
	const forceUpdate = useForceUpdate()
	const queryData = useQuery({
		queryKey: [queryKeys.EXAM_QUESTIONS, { examId: id }],
		queryFn: () => apiGetExamQuestions(String(id))
	})
	const timeLeft = queryData.data ?
		timeUtils.countDown(new Date(Date.parse(queryData.data.startedAt!) + queryData.data.examTime * 60000)) : ''
	// const handleSubmitExam = async () => {
	// 	await apiSubmitExam(String(id), answers)
	// }
	const { mutateAsync } = useMutation({
		mutationFn: () => apiSubmitExam(String(id), answers),
		onSuccess: (data) => {
			console.log(data)
		},
	})
	const onMutateSuccess = () => {
		// localStorage.removeItem(localStorageKey)
		// navigate(`/exams/${id}`)
	}
	useEffect(() => {
		const interval = setInterval(() => {
			forceUpdate()
		}, 500)
		return () => clearInterval(interval)
	}, [forceUpdate])
	useEffect(() => {
		if (!queryData.data) return
		document.title = queryData.data.name
		const newAnswers = Array(queryData.data.questions.length).fill(-1)
		if (answers.length !== newAnswers.length) {
			setAnswers(newAnswers)
			localStorage.setItem(localStorageKey, JSON.stringify(newAnswers))
		}
		else {
			localStorage.setItem(localStorageKey, JSON.stringify(answers))
		}
		return () => {
			if (answers.length === 0) localStorage.removeItem(localStorageKey)
		}
	}, [answers, localStorageKey, queryData.data])
	return (
		<>
			<ScorePopUp />
			{showSubmitPopUp ?
				<YesNoPopUp
					mutateFunction={mutateAsync}
					setShowPopUp={setShowSubmitPopUp}
					langYes={language?.langYes}
					langNo={language?.langNo}
					message={language?.submitMessage.replace('@time', timeLeft) || ''}
					onMutateSuccess={onMutateSuccess}
				/> : null
			}
			{queryData.isLoading ? < Loading /> : null}
			{
				queryData.data ?
					<>
						<div className={styles['take-exam-container']}>
							<div className={
								[
									styles['data-container']
								].join(' ')
							}>
								<div className={
									[
										styles['title']
									].join(' ')
								}>
									<div>
										{queryData.data.name}
									</div>
									<div>
										{language?.timeLeft}: {timeLeft}
									</div>
								</div>
								<div className={[
									styles['questions-container']
								].join(' ')
								}>
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
											)
										})
									}
								</div>
								{language?.numberOfQuestionsAnswered}: {answers.filter(i => i !== -1).length}/{answers.length}
								<div className={styles['action-items']}>
									<button name='save'
										onClick={() => { setShowSubmitPopUp(true) }}
										className={
											[
												'action-item-d',
												// isPending ? 'button-submitting' : ''
											].join(' ')
										}>{language?.submit}
									</button>
								</div>
							</div>
						</div>
					</> : null
			}
		</>
	)
}

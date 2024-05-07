import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetExamQuestions } from '../api/exam'
import ExamQuestion from '../components/ExamQuestion'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useForceUpdate from '../hooks/useForceUpdate'
import useLanguage from '../hooks/useLanguage'
import { PageTakeExamLang } from '../models/lang'
import styles from '../styles/TakeExam.module.css'
import timeUtils from '../utils/timeUtils'

export default function TakeExam() {
	const { id } = useParams()
	const localStorageKey = `exam_${id}`
	const [answers, setAnswers] = useState<number[]>(() => {
		const data = localStorage.getItem(localStorageKey)
		if (data === null) {
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
	const forceUpdate = useForceUpdate()
	const queryData = useQuery({
		queryKey: [queryKeys.EXAM_QUESTIONS, { examId: id }],
		queryFn: () => apiGetExamQuestions(String(id))
	})
	useEffect(() => {
		const interval = setInterval(() => {
			forceUpdate()
		}, 500)
		return () => clearInterval(interval)
	}, [forceUpdate])
	useEffect(() => {
		if (!queryData.data) return
		document.title = queryData.data.name
		if (answers.length !== queryData.data.questions.length) {
			answers.length = queryData.data.questions.length
			answers.fill(-1)
			setAnswers(structuredClone(answers))
			localStorage.setItem(localStorageKey, JSON.stringify(answers))
		}
		else {
			localStorage.setItem(localStorageKey, JSON.stringify(answers))
		}
	}, [answers, localStorageKey, queryData.data])
	return (
		<>
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
										{language?.timeLeft}: {timeUtils.countDown(new Date(Date.parse(queryData.data.startedAt!) + queryData.data.examTime * 60000))}
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

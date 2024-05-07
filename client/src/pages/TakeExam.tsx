import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiGetExamQuestions } from '../api/exam'
import ExamQuestion from '../components/ExamQuestion'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useForceUpdate from '../hooks/useForceUpdate'
import styles from '../styles/TakeExam.module.css'
import timeUtils from '../utils/timeUtils'

export default function TakeExam() {
	const { id } = useParams()
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
	}, [queryData.data])
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
									<span>
										{queryData.data.name}
									</span>
									<span>
										{timeUtils.countDown(new Date(Date.parse(queryData.data.startedAt!) + queryData.data.examTime * 60000))}
									</span>
								</div>
								<div className={[
									styles['questions-container']
								].join(' ')
								}>
									{
										queryData.data.questions.map((question, index) => {
											return (
												<ExamQuestion
													index={index}
													key={`exam-question-${question.id}`}
													question={question}
												/>
											)
										})
									}
								</div>
								<div className={styles['action-items']}>
									<button name='save'
										className={
											[
												'action-item-d',
												// isPending ? 'button-submitting' : ''
											].join(' ')
										}>{'Nộp'}</button>
								</div>
							</div>
						</div>
					</> : null
			}
		</>
	)
}

import { useState } from 'react'
import { MdOutlineRadioButtonChecked } from 'react-icons/md'
import useLanguage from '../hooks/useLanguage'
import { ExamQuestion as TExamQuestion } from '../models/exam'
import { ComponentExamQuestionLang } from '../models/lang'
import styles from '../styles/ExamQuestion.module.css'

type ExamQuestionProps = {
	index: number
	question: TExamQuestion
	answerIndex: number
	setAnswers: React.Dispatch<React.SetStateAction<number[]>>
}
export default function ExamQuestion({
	index,
	question,
	answerIndex,
	setAnswers
}: ExamQuestionProps) {
	const [checkedIndex, setCheckedIndex] = useState(answerIndex)
	const language = useLanguage<ComponentExamQuestionLang>('component.exam_question')
	return (
		<div className={styles['exam-question-container']}>
			{/* <input hidden name='answers[]' value={checkedIndex} onChange={() => { }} /> */}
			<span className={styles['question-content']}>
				{language?.question} {index + 1}. {question.content}
			</span>
			{
				question.questionOptions.map((option, i) => {
					return (
						<div
							onClick={() => {
								setCheckedIndex(i)
								setAnswers(pre => {
									pre[index] = i
									return structuredClone(pre)
								})
							}}
							className={
								[
									styles['question-option-container']
								].join(' ')
							}
							key={`exam-question-option-${option.id}`}
						>
							<span className={
								[
									styles['question-option']
								].join(' ')
							}>
								{i + 1}. {option.content}
							</span>
							{
								checkedIndex === i ?
									<MdOutlineRadioButtonChecked />
									: null
							}
						</div>
					)
				})
			}
		</div>
	)
}

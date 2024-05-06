import { useState } from 'react'
import { MdOutlineRadioButtonChecked } from 'react-icons/md'
import { ExamQuestion as TExamQuestion } from '../models/exam'
import styles from '../styles/ExamQuestion.module.css'

type ExamQuestionProps = {
	index: number
	question: TExamQuestion
}
export default function ExamQuestion({
	index,
	question
}: ExamQuestionProps) {
	const [checkedIndex, setCheckedIndex] = useState(-1)
	return (
		<div className={styles['exam-question-container']}>
			<span className={styles['question-content']}>
				Câu {index + 1}. {question.content}
			</span>
			{
				question.questionOptions.map((option, i) => {
					return (
						<div
							onClick={() => {
								setCheckedIndex(i)
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

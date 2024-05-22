import { useState } from 'react'
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md'
import useLanguage from '../hooks/useLanguage'
import { ExamQuestion as TExamQuestion } from '../models/exam'
import { ComponentExamQuestionLang } from '../models/lang'
import styles from '../styles/ExamQuestion.module.css'
import languageUtils from '../utils/languageUtils'

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
									styles['question-option-container'],
									checkedIndex === i ? styles['checked'] : ''
								].join(' ')
							}
							key={`exam-question-option-${option.id}`}
						>
							{
								checkedIndex === i ? <MdOutlineRadioButtonChecked />
									: <MdOutlineRadioButtonUnchecked />
							}
							<span className={
								[
									styles['question-option']
								].join(' ')
							}>
								{languageUtils.getLetterFromIndex(i)}. {option.content}
							</span>
						</div>
					)
				})
			}
		</div>
	)
}

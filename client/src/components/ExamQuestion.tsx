import { ExamQuestion as TExamQuestion } from '../models/exam'
import styles from '../styles/ExamQuestion.module.css'

type ExamQuestionProps = {
	question: TExamQuestion
}
export default function ExamQuestion({
	question
}: ExamQuestionProps) {
	console.log(question)
	return (
		<div className={styles['exam-question-container']}>
			{question.content}
		</div>
	)
}

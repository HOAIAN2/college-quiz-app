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
	return (
		<div className={styles['exam-question-container']}>
			<span className={styles['question-content']}>
				Câu {index + 1}. {question.content}
			</span>
			{
				question.questionOptions.map((option, i) => {
					return (
						<div className={styles['question-option']}
							key={`exam-question-option-${option.id}`}
						>
							<span className={styles['question-option']}>
								{i + 1}. {option.content}
							</span>
						</div>
					)
				})
			}
		</div>
	)
}

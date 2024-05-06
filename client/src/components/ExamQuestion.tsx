import { ExamQuestion as TExamQuestion } from '../models/exam'

type ExamQuestionProps = {
	question: TExamQuestion
}
export default function ExamQuestion({
	question
}: ExamQuestionProps) {
	console.log(question)
	return (
		<div>{question.content}</div >
	)
}

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { apiGetExamQuestions } from '../api/exam'
import ExamQuestion from '../components/ExamQuestion'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'

export default function TakeExam() {
	const { id } = useParams()
	const queryData = useQuery({
		queryKey: [queryKeys.EXAM_QUESTIONS, { examId: id }],
		queryFn: () => apiGetExamQuestions(String(id))
	})
	return (
		<>
			{queryData.isLoading ? < Loading /> : null}
			{
				queryData.data ?
					<>
						{
							queryData.data.questions.map(question => {
								return (
									<ExamQuestion question={question} />
								)
							})
						}
					</> : null
			}
			<div>TakeExam</div>
		</>
	)
}

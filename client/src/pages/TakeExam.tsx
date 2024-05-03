import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { apiGetExamQuestions } from '../api/exam'
import { queryKeys } from '../constants/query-keys'

export default function TakeExam() {
	const { id } = useParams()
	const queryData = useQuery({
		queryKey: [queryKeys.EXAM_QUESTIONS],
		queryFn: () => apiGetExamQuestions(String(id))
	})
	if (queryData.data) console.log(queryData.data)
	return (
		<div>TakeExam</div>
	)
}

import { useQuery } from '@tanstack/react-query'
import { apiGetUpcommingExams } from '../api/exam'
import { queryKeys } from '../constants/query-keys'

export default function Exams() {
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_EXAMS],
		queryFn: () => apiGetUpcommingExams()
	})
	queryData.data && console.log(queryData.data)
	return (
		<div>Exams</div>
	)
}

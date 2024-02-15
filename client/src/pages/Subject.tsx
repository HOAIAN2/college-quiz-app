import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { apiGetSubjectById } from '../api/subject'
import { queryKeys } from '../constants/query-keys'

export default function Subject() {
	const { id } = useParams()
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SUBJECT, { id: id }],
		queryFn: () => apiGetSubjectById(String(id))
	})
	if (queryData.data) console.log(queryData.data)
	return (
		<div>Subject</div>
	)
}

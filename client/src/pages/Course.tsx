import { useParams } from 'react-router-dom'

export default function Course() {
	const { id } = useParams()
	return (
		<div>Course {id}</div>
	)
}

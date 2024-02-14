import { useParams } from 'react-router-dom'

export default function Subject() {
	const { id } = useParams()
	console.log(id)
	return (
		<div>Subject</div>
	)
}

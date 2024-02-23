import { useParams } from 'react-router-dom'

export default function Questions() {
	const { id } = useParams()
	console.log(id)
	return (
		<div>Questions</div>
	)
}

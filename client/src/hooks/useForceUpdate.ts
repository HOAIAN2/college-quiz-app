import { useState } from 'react'

export default function useForceUpdate() {
	const [, setState] = useState<void>()
	return setState
}

import { useState } from 'react';

export default function useForceUpdate() {
	const [, setState] = useState(true);
	return () => { setState(pre => !pre); };
}

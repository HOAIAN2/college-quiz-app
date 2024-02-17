import useLanguage from '../hooks/useLanguage'
import { ComponentLoadingLang } from '../models/lang'

export default function Loading() {
	const language = useLanguage<ComponentLoadingLang>('component.loading')
	return (
		<div className='data-loading'
			style={{ zIndex: 10 }}
		>{language?.text}</div>
	)
}

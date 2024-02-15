import { useQuery } from '@tanstack/react-query'
import { MdDeleteOutline } from 'react-icons/md'
import { RiAddFill } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import { apiGetSubjectById } from '../api/subject'
import Loading from '../components/Loading'
import { queryKeys } from '../constants/query-keys'
import useAppContext from '../hooks/useAppContext'
import useLanguage from '../hooks/useLanguage'
import { PageSubjectLang } from '../models/lang'
import styles from '../styles/Subject.module.css'

export default function Subject() {
	const { id } = useParams()
	const { permissions } = useAppContext()
	const language = useLanguage<PageSubjectLang>('page.subject')
	const queryData = useQuery({
		queryKey: [queryKeys.PAGE_SUBJECT, { id: id }],
		queryFn: () => apiGetSubjectById(String(id))
	})
	return (
		<>
			<div className={
				[
					'dashboard-d',
					styles['page-content']
				].join(' ')
			}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					queryData.data ?
						<>
							{queryData.data?.name}
							<div className={
								[
									'action-bar-d'
								].join(' ')
							}>
								{
									permissions.has('user_create') ?
										<div className={
											[
												'action-item-d'
											].join(' ')
										}
										// onClick={() => {
										// 	setInsertMode(true)
										// }}
										>
											<RiAddFill /> {language?.add}
										</div>
										: null
								}
								{
									permissions.has('user_delete') ?
										<div
											// onClick={() => {
											// 	setShowPopUpMode(true)
											// }}
											className={
												[
													'action-item-d-white-border-red'
												].join(' ')
											}>
											<MdDeleteOutline /> {language?.delete}
										</div>
										: null
								}
							</div>
						</> : null
				}
			</div>
		</>
	)
}

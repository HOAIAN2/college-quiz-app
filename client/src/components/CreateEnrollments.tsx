import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { apiGetAllStudent } from '../api/user'
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env'
import { queryKeys } from '../constants/query-keys'
import useDebounce from '../hooks/useDebounce'
import styles from '../styles/CreateEnrollments.module.css'

type CreateEnrollmentsProps = {
	onMutateSuccess: () => void
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateEnrollments({
	// onMutateSuccess,
	setShowPopUp
}: CreateEnrollmentsProps) {
	const [hide, setHide] = useState(true)
	const [queryUser, setQueryUser] = useState('')
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE)
	const [selectedUserIds, setSelectedUserIds] = useState<Set<string | number>>(new Set())
	const handleClosePopUp = () => {
		const transitionTiming = getComputedStyle(document.documentElement).getPropertyValue('--transition-timing-fast')
		const timing = Number(transitionTiming.replace('s', '')) * 1000
		setHide(true)
		setTimeout(() => {
			setShowPopUp(false)
		}, timing)
	}
	const userQueryData = useQuery({
		queryKey: [queryKeys.ALL_STUDENT, { search: debounceQueryUser }],
		queryFn: () => apiGetAllStudent(debounceQueryUser),
	})
	useEffect(() => {
		setHide(false)
	}, [])
	return (
		<div className={
			[
				styles['create-enrollments-container'],
				hide ? styles['hide'] : ''
			].join(' ')
		}>
			{
				// isPending ? <Loading /> : null
			}
			<div className={
				[
					styles['create-enrollments-form'],
					hide ? styles['hide'] : ''
				].join(' ')
			}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{'Thêm sinh viên'}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div className={
					[
						styles['form-content']
					].join(' ')
				}>
				</div>
			</div>
		</div>
	)
}

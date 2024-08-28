import appStyles from '~styles/App.module.css';
import styles from '~styles/CardPage.module.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LuBookOpenCheck } from 'react-icons/lu';
import { RiAddFill } from 'react-icons/ri';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { apiGetSemesters } from '~api/semester';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import CreateSemester from './components/CreateSemester';

export default function Semesters() {
	const { permissions, appLanguage } = useAppContext();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const queryDebounce = useDebounce(searchQuery);
	const language = useLanguage('page.subjects');
	const [showCreatePopUp, setShowCreatePopUp] = useState(false);
	const queryClient = useQueryClient();
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.PAGE_SEMESTERS, { search: queryDebounce }],
		queryFn: () => apiGetSemesters(queryDebounce),
		enabled: permissions.has('semester_view')
	});
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return;
		if (queryDebounce === '') searchParams.delete('search');
		else searchParams.set('search', queryDebounce);
		setSearchParams(searchParams);
	}, [queryDebounce, searchParams, setSearchParams]);
	const onMutateSuccess = () => {
		[QUERY_KEYS.PAGE_SEMESTERS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] });
		});
	};
	if (!permissions.has('semester_view')) return <Navigate to='/' />;
	return (
		<>
			{showCreatePopUp === true ?
				<CreateSemester
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null}
			<div className={appStyles.dashboard}>
				{
					permissions.hasAnyFormList(['semester_create', 'semester_update', 'semester_delete'])
						?
						<div className={appStyles.actionBar}>
							{
								permissions.has('semester_create') ?
									<div
										className={appStyles.actionItem}
										onClick={() => {
											setShowCreatePopUp(true);
										}}
									>
										<RiAddFill /> {language?.add}
									</div>
									: null
							}
						</div>
						: null
				}
				<div className={styles.pageContent}>
					{
						queryData.isLoading ? <Loading /> : null
					}
					<div className={styles.filterForm}>
						<div className={styles.wrapInputItem}>
							<label>{language?.filter.search}</label>
							<input
								onInput={(e) => {
									setSearchQuery(e.currentTarget.value);
								}}
								defaultValue={queryDebounce}
								className={css(appStyles.input, styles.inputItem)}
							/>
						</div>
					</div>
					<div className={styles.wrapCardContainer}>
						<div className={styles.cardContainer}>
							{queryData.data ?
								queryData.data.map(item => {
									return (
										<Link
											to={String(item.id)}
											key={`semester-${item.id}`}
											className={css(appStyles.dashboardCard, styles.card)}>
											<div className={styles.cardTop}>
												{item.name}
											</div>
											<div className={styles.cardBottom}>
												<LuBookOpenCheck />
												{
													[
														new Date(item.startDate).toLocaleDateString(appLanguage.language),
														new Date(item.endDate).toLocaleDateString(appLanguage.language),
													].join(' - ')
												}
											</div>
										</Link>
									);
								}) : null}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

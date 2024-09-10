import appStyles from '~styles/App.module.css';
import styles from '~styles/CardPage.module.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LuBookOpenCheck } from 'react-icons/lu';
import { RiAddFill } from 'react-icons/ri';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { apiGetSubjects } from '~api/subject';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import CreateSubject from './components/CreateSubject';

export default function Subjects() {
	const { permissions, appTitle } = useAppContext();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const queryDebounce = useDebounce(searchQuery);
	const language = useLanguage('page.subjects');
	const [showCreatePopUp, setShowCreatePopUp] = useState(false);
	const queryClient = useQueryClient();
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.PAGE_SUBJECTS, { search: queryDebounce }],
		queryFn: () => apiGetSubjects(queryDebounce),
		enabled: permissions.has('subject_view')
	});
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return;
		if (queryDebounce === '') searchParams.delete('search');
		else searchParams.set('search', queryDebounce);
		setSearchParams(searchParams);
	}, [queryDebounce, searchParams, setSearchParams]);
	const onMutateSuccess = () => {
		[QUERY_KEYS.PAGE_SUBJECTS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] });
		});
	};
	useEffect(() => {
		if (language) appTitle.setAppTitle(language.subjects);
	}, [appTitle, language]);
	if (!permissions.has('subject_view')) return <Navigate to='/' />;
	return (
		<>
			{showCreatePopUp === true ?
				<CreateSubject
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null}
			<main className={appStyles.dashboard}>
				{
					permissions.hasAnyFormList(['subject_create'])
						?
						<section className={appStyles.actionBar}>
							{
								permissions.has('subject_create') ?
									<button
										className={appStyles.actionItem}
										onClick={() => {
											setShowCreatePopUp(true);
										}}
									>
										<RiAddFill /> {language?.add}
									</button>
									: null
							}
						</section>
						: null
				}
				<section className={styles.pageContent}>
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
											key={`subject-${item.id}`}
											to={String(item.id)}
											className={css(appStyles.dashboardCard, styles.card)}
										>
											<div className={styles.cardTop}>
												<p className={styles.content}>
													{item.name}
												</p>
											</div>
											<div className={styles.cardBottom}>
												<LuBookOpenCheck />
												{item.shortcode}
											</div>
										</Link>
									);
								}) : null}
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LuBookOpenCheck } from 'react-icons/lu';
import { RiAddFill } from 'react-icons/ri';
import { Link, useSearchParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiGetSubjects } from '../api/subject';
import CreateSubject from '../components/CreateSubject';
import Loading from '../components/Loading';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/global/CardPage.module.css';
import css from '../utils/css';

export default function Subjects() {
	const { permissions } = useAppContext();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const queryDebounce = useDebounce(searchQuery);
	const language = useLanguage('page.subjects');
	const [showCreatePopUp, setShowCreatePopUp] = useState(false);
	const queryClient = useQueryClient();
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.PAGE_SUBJECTS, { search: queryDebounce }],
		queryFn: () => apiGetSubjects(queryDebounce)
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
	return (
		<>
			{showCreatePopUp === true ?
				<CreateSubject
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null}
			<main className={appStyles['dashboard-d']}>
				{
					permissions.hasAnyFormList(['subject_create'])
						?
						<section className={appStyles['action-bar-d']}>
							{
								permissions.has('subject_create') ?
									<button
										className={appStyles['action-item-d']}
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
				<section className={styles['page-content']}>
					{
						queryData.isLoading ? <Loading /> : null
					}
					<div className={styles['filter-form']}>
						<div className={styles['wrap-input-item']}>
							<label>{language?.filter.search}</label>
							<input
								onInput={(e) => {
									setSearchQuery(e.currentTarget.value);
								}}
								defaultValue={queryDebounce}
								className={css(appStyles['input-d'], styles['input-item'])}
							/>
						</div>
					</div>
					<div className={styles['wrap-card-container']}>
						<div className={styles['card-container']}>
							{queryData.data ?
								queryData.data.map(item => {
									return (
										<Link
											key={`subject-${item.id}`}
											to={String(item.id)}
											className={css(appStyles['dashboard-card-d'], styles['card'])}
										>
											<div className={styles['card-top']}>
												<p className={styles['content']}>
													{item.name}
												</p>
											</div>
											<div className={styles['card-bottom']}>
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

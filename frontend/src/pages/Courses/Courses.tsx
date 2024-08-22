import { apiGetCourses } from '@api/course';
import { apiGetSemesterById } from '@api/semester';
import Loading from '@components/Loading';
import QUERY_KEYS from '@constants/query-keys';
import useAppContext from '@hooks/useAppContext';
import useDebounce from '@hooks/useDebounce';
import useLanguage from '@hooks/useLanguage';
import { Semester } from '@models/semester';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import css from '@utils/css';
import { useEffect, useState } from 'react';
import { LuBookOpenCheck } from 'react-icons/lu';
import { RiAddFill } from 'react-icons/ri';
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import CreateCourse from './components/CreateCourse';

import appStyles from '@styles/App.module.css';
import styles from '@styles/CardPage.module.css';

export default function Courses() {
	const { state } = useLocation() as { state: Semester | null; };
	const [semesterDetail, setSemesterDetail] = useState(state);
	const [showCreatePopUp, setShowCreatePopUp] = useState(false);
	const { permissions, appTitle } = useAppContext();
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const queryDebounce = useDebounce(searchQuery);
	const language = useLanguage('page.courses');
	const queryClient = useQueryClient();
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.PAGE_COURSES, {
			search: queryDebounce,
			semesterId: Number(id)
		}],
		queryFn: () => apiGetCourses({
			search: queryDebounce,
			semesterId: Number(id) || undefined
		}),
		enabled: permissions.has('course_view')
	});
	useEffect(() => {
		apiGetSemesterById(String(id))
			.then(res => {
				setSemesterDetail(res);
			});
	}, [id]);
	const onMutateSuccess = () => {
		[QUERY_KEYS.PAGE_COURSES, QUERY_KEYS.PAGE_DASHBOARD].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] });
		});
	};
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return;
		if (queryDebounce === '') searchParams.delete('search');
		else searchParams.set('search', queryDebounce);
		setSearchParams(searchParams);
	}, [queryDebounce, searchParams, setSearchParams]);
	useEffect(() => {
		if (language && semesterDetail) {
			appTitle.setAppTitle(language.title.replace('@semester', semesterDetail.name));
		}
	}, [appTitle, language, semesterDetail]);
	if (!semesterDetail) return null;
	if (!permissions.has('course_view')) return <Navigate to='/' />;
	return (
		<>
			{showCreatePopUp && queryData.data ?
				<CreateCourse
					semester={semesterDetail}
					numberOfCourses={queryData.data.length}
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowCreatePopUp}
				/> : null}
			<main className={appStyles['dashboard-d']}>
				{
					permissions.hasAnyFormList(['course_create',])
						?
						<section className={appStyles['action-bar-d']}>
							{
								permissions.has('course_create') ?
									<div
										className={appStyles['action-item-d']}
										onClick={() => {
											setShowCreatePopUp(true);
										}}
									>
										<RiAddFill /> {language?.add}
									</div>
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
											key={`course-${item.id}`}
											to={`${item.id}`}
											className={css(appStyles['dashboard-card-d'], styles['card'])
											}>
											<div className={styles['card-top']}>
												{item.name}
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
			</main >
		</>
	);
}

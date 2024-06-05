import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LuBookOpenCheck } from 'react-icons/lu';
import { RiAddFill } from 'react-icons/ri';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiGetCourses } from '../api/course';
import { apiGetSemesterById } from '../api/semester';
import CreateCourse from '../components/CreateCourse';
import Loading from '../components/Loading';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import { Semester } from '../models/semester';
import styles from '../styles/global/CardPage.module.css';
import css from '../utils/css';

export default function Courses() {
	const { state } = useLocation() as { state: Semester | null; };
	const [semesterDetail, setSemesterDetail] = useState(state);
	const [showCreatePopUp, setShowCreatePopUp] = useState(false);
	const { permissions, DOM } = useAppContext();
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
		})
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
		if (language) {
			document.title = language?.title.replace('@semester', semesterDetail?.name || '');
			if (DOM.titleRef.current) DOM.titleRef.current.textContent = document.title;
		}
	}, [semesterDetail, language, DOM.titleRef]);
	if (!semesterDetail) return null;
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

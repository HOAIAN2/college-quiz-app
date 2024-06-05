import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { RiAddFill } from 'react-icons/ri';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiGetQuestions } from '../api/question';
import { apiGetSubjectById } from '../api/subject';
import CreateQuestion from '../components/CreateQuestion';
import CustomSelect from '../components/CustomSelect';
import Loading from '../components/Loading';
import ViewQuestion from '../components/ViewQuestion';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import { SubjectDetail } from '../models/subject';
import styles from '../styles/global/CardPage.module.css';
import css from '../utils/css';

export default function Questions() {
	const { state } = useLocation() as { state: SubjectDetail | null; };
	const [subjectDetail, setSubjectDetail] = useState(state);
	const [searchParams, setSearchParams] = useSearchParams();
	const [showCreatePopUp, setShowCreatePopUp] = useState(false);
	const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
	const [questionId, setQuestionId] = useState<number>(0);
	const [showViewPopUp, setShowViewPopUp] = useState(false);
	const queryDebounce = useDebounce(searchQuery);
	const { permissions, DOM } = useAppContext();
	const { id } = useParams();
	const language = useLanguage('page.questions');
	const queryData = useQuery({
		queryKey: [
			QUERY_KEYS.PAGE_QUESTIONS,
			{
				chapter: searchParams.get('chapter') || '10',
				search: queryDebounce
			},
		],
		queryFn: () => apiGetQuestions({
			subjectId: String(id),
			chapterId: searchParams.get('chapter'),
			search: queryDebounce
		})
	});
	useEffect(() => {
		apiGetSubjectById(String(id)).then(res => {
			setSubjectDetail(res);
		});
	}, [id]);
	useEffect(() => {
		if (!searchParams.get('search') && !queryDebounce) return;
		if (queryDebounce === '') searchParams.delete('search');
		else searchParams.set('search', queryDebounce);
		setSearchParams(searchParams);
	}, [queryDebounce, searchParams, setSearchParams]);
	useEffect(() => {
		if (language) {
			document.title = language?.title.replace('@subject', subjectDetail?.name || '');
			if (DOM.titleRef.current) DOM.titleRef.current.textContent = document.title;
		}
	}, [subjectDetail, language, DOM.titleRef]);
	if (!subjectDetail) return null;
	return (
		<>
			{showViewPopUp === true ?
				<ViewQuestion
					id={questionId}
					subjectDetail={subjectDetail}
					setShowPopUp={setShowViewPopUp}
					onMutateSuccess={() => { queryData.refetch(); }}
				/>
				: null
			}
			{showCreatePopUp === true ?
				<CreateQuestion
					onMutateSuccess={() => { queryData.refetch(); }}
					setShowPopUp={setShowCreatePopUp}
					subjectDetail={subjectDetail}
				/> : null}
			<main className={appStyles['dashboard-d']}>
				{
					permissions.hasAnyFormList(['question_create'])
						?
						<section className={appStyles['action-bar-d']}>
							{
								permissions.has('question_create') ?
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
							<label>{language?.filter.chapter}</label>
							<CustomSelect
								defaultOption={
									{
										label: language?.unselect,
										value: ''
									}
								}
								options={
									[
										{
											label: language?.unselect,
											value: ''
										},
										...subjectDetail.chapters.map(chapter => ({
											value: String(chapter.id),
											label: `${chapter.chapterNumber}. ${chapter.name}`
										}))]
								}
								onChange={(option) => {
									if (option.value != '') searchParams.set('chapter', option.value);
									else searchParams.delete('chapter');
									setSearchParams(searchParams);
								}}
								className={styles['custom-select']}
							/>
						</div>
						<div className={styles['wrap-input-item']}>
							<label htmlFor="">{language?.filter.search}</label>
							<input
								onInput={(e) => {
									setSearchQuery(e.currentTarget.value);
								}}
								name='search'
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
										<div
											onClick={() => {
												setQuestionId(item.id);
												setShowViewPopUp(true);
											}}
											key={`subject-${item.id}`}
											className={css(appStyles['dashboard-card-d'], styles['card'])}>
											<div className={styles['card-top']}>
												<p className={styles['content']}>
													{item.content}
												</p>
											</div>
											<div className={styles['card-bottom']}>
												<AiOutlineQuestionCircle />
												{language?.questionLevel[item.level]}
											</div>
										</div>
									);
								}) : null}
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

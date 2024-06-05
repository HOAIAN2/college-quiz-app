import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import { apiDeleteSubject, apiGetSubjectById, apiUpdateSubject } from '../api/subject';
import CreateChapter from '../components/CreateChapter';
import Loading from '../components/Loading';
import ViewChapter from '../components/ViewChapter';
import YesNoPopUp from '../components/YesNoPopUp';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import { Chapter } from '../models/chapter';
import styles from '../styles/Subject.module.css';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';

export default function Subject() {
	const { id } = useParams();
	const { permissions } = useAppContext();
	const language = useLanguage('page.subject');
	const [currentChapter, setCurrentChapter] = useState<Chapter>();
	const queryClient = useQueryClient();
	const [showDeletePopUp, setShowDeletePopUp] = useState(false);
	const [showViewChapterPopUp, setShowViewChapterPopUp] = useState(false);
	const [showCreateChapterPopUp, setShowCreateChapterPopUp] = useState(false);
	const navigate = useNavigate();
	const formUtils = createFormUtils(styles);
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.PAGE_SUBJECT, { id: id }],
		queryFn: () => apiGetSubjectById(String(id))
	});
	const handleUpdateSubject = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		if (!permissions.has('subject_update')) return;
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll('input[name]').forEach(node => {
			const element = node as HTMLInputElement;
			element.classList.remove('error');
			formUtils.getParentElement(element)?.removeAttribute('data-error');
		});
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		queryData.data && await apiUpdateSubject(formData, queryData.data.id);
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateSubject,
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: () => { queryData.refetch(); }
	});
	const handleDeletetSubject = async () => {
		await apiDeleteSubject(String(id));
	};
	const onMutateSuccess = () => {
		[QUERY_KEYS.PAGE_SUBJECTS].forEach(key => {
			queryClient.refetchQueries({ queryKey: [key] });
		});
		navigate('/subjects');
	};
	const defaultChapterNumber = queryData.data && queryData.data.chapters.length !== 0
		? Math.max(...queryData.data.chapters.map(chapter => chapter.chapterNumber)) + 1 : 1;
	useEffect(() => {
		return () => {
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.PAGE_SUBJECT, { id: id }] });
		};
	}, [id, queryClient]);
	return (
		<>
			{showViewChapterPopUp && currentChapter ?
				<ViewChapter
					data={currentChapter}
					onMutateSuccess={() => { queryData.refetch(); }}
					setShowPopUp={setShowViewChapterPopUp}
				/>
				: null
			}
			{showCreateChapterPopUp === true ?
				<CreateChapter
					defaultChapterNumber={defaultChapterNumber}
					subjectId={String(id)}
					onMutateSuccess={() => { queryData.refetch(); }}
					setShowPopUp={setShowCreateChapterPopUp}
				/> : null}
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeletetSubject}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={onMutateSuccess}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<main className={css(appStyles['dashboard-d'], styles['page-content'])}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					isPending ? <Loading /> : null
				}
				{
					queryData.data ?
						<>
							<section className={styles['form-content']}>
								<div className={styles['header']}>
									<h2 className={styles['title']}>{queryData.data.name}</h2>
								</div>
								<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
									mutate(e);
								}}
									onInput={e => { formUtils.handleOnInput(e); }}
									className={styles['form-data']}>
									<input name='is_active' defaultValue='1' hidden />
									<div className={styles['group-inputs']}>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
											<input
												id='shortcode'
												disabled={!permissions.has('subject_update')}
												defaultValue={queryData.data.shortcode}
												name='shortcode'
												className={css(appStyles['input-d'], styles['input-item'])}
												type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='name'>{language?.name}</label>
											<input
												id='name'
												disabled={!permissions.has('subject_update')}
												defaultValue={queryData.data.name}
												name='name'
												className={css(appStyles['input-d'], styles['input-item'])}
												type='text' />
										</div>
									</div>
									{
										permissions.hasAnyFormList(['subject_update', 'subject_delete']) ?
											<div className={styles['action-items']}>
												{
													permissions.has('subject_update') ?
														<button name='save'
															className={
																css(
																	appStyles['action-item-d'],
																	isPending ? appStyles['button-submitting'] : ''
																)
															}
														>{language?.save}</button> : null
												}
												{
													permissions.has('subject_delete') ?
														<button
															type='button'
															onClick={() => {
																setShowDeletePopUp(true);
															}}
															className={appStyles['action-item-white-border-red-d']}>
															<MdDeleteOutline /> {language?.delete}
														</button>
														: null
												}
											</div>
											: null
									}
								</form>
							</section>
							<div className={styles['header']}>
								<h2 className={styles['title']}>{language?.chapters}</h2>
							</div>
							{
								permissions.has('subject_update') ?
									<div className={appStyles['action-bar-d']}
										style={{ paddingLeft: '20px' }}
									>
										<div className={appStyles['action-item-d']}
											onClick={() => {
												setShowCreateChapterPopUp(true);
											}}
										>
											<RiAddFill /> {language?.add}
										</div>
									</div>
									: null
							}
							<div className={styles['chapters-container']}>
								{
									queryData.data.chapters.sort((a, b) =>
										a.chapterNumber - b.chapterNumber
									)
										.map(chapter => {
											return (
												<div
													key={`chapter-${chapter.id}`}
													className={css(appStyles['dashboard-card-d'], styles['card'])}
													onClick={() => {
														setCurrentChapter(chapter);
														setShowViewChapterPopUp(true);
													}}
												>
													<div className={styles['card-top']}>
														{`${chapter.chapterNumber}. ${chapter.name}`}
													</div>
													<div className={styles['card-bottom']}>
														{`${chapter.questionsCount} ${language?.questions.toLocaleLowerCase()}`}
													</div>
												</div>
											);
										})
								}
							</div>
							{
								permissions.has('question_view') ?
									<Link
										to='questions'
										state={queryData.data}
										className={styles['header']}>
										<h2 className={styles['title']}>
											{language?.questions}
										</h2>
									</Link>
									: null
							}
						</> : null
				}
			</main>
		</>
	);
}

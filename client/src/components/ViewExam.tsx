import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Datetime from 'react-datetime';
import { FiSave } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import appStyles from '../App.module.css';
import { apiDeleteExam, apiGetExamById, apiUpdateExam } from '../api/exam';
import { apiGetAllUser } from '../api/user';
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import { User } from '../models/user';
import styles from '../styles/CreateViewExam.module.css';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';
import languageUtils from '../utils/languageUtils';
import renderMonth from '../utils/renderMonth';
import Loading from './Loading';
import YesNoPopUp from './YesNoPopUp';

type ViewExamProps = {
	id: number;
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ViewExam({
	id,
	onMutateSuccess,
	setShowPopUp
}: ViewExamProps) {
	const { permissions } = useAppContext();
	const [hide, setHide] = useState(true);
	const [supervisors, setSupervisors] = useState<User[]>([]);
	const [queryUser, setQueryUser] = useState('');
	const [showDeletePopUp, setShowDeletePopUp] = useState(false);
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE);
	const language = useLanguage('component.view_exam');
	const queryClient = useQueryClient();
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, TRANSITION_TIMING_FAST);
	};
	const disabledUpdate = !permissions.has('exam_update');
	const formUtils = createFormUtils(styles);
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.EXAM, { id: id }],
		queryFn: () => apiGetExamById(id),
	});
	const userQueryData = useQuery({
		queryKey: [QUERY_KEYS.ALL_TEACHER, { search: debounceQueryUser }],
		queryFn: () => apiGetAllUser('teacher', debounceQueryUser),
		enabled: permissions.has('user_view') ? true : false
	});
	const handleUpdateExam = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error');
			formUtils.getParentElement(node)?.removeAttribute('data-error');
		});
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		supervisors.forEach(supervisor => {
			formData.append('supervisor_ids[]', String(supervisor.id));
		});
		await apiUpdateExam(formData, id);
		handleClosePopUp();
	};
	const handleDeleteExam = async () => {
		await apiDeleteExam(id);
	};
	const isExamStarted = () => {
		if (!queryData.data) return false;
		if (!queryData.data.startedAt) return false;
		const examStartedAt = new Date(queryData.data.startedAt);
		return new Date().getTime() > examStartedAt.getTime();
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateExam,
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		if (queryData.data) {
			setSupervisors(queryData.data.examSupervisors.map(supervisor => supervisor.user));
		}
	}, [queryData.data]);
	useEffect(() => {
		setHide(false);
		return () => {
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.EXAM, { id: id }] });
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.ALL_TEACHER] });
		};
	}, [id, queryClient]);
	return (
		<>
			{showDeletePopUp === true ?
				<YesNoPopUp
					message={language?.deleteMessage || ''}
					mutateFunction={handleDeleteExam}
					setShowPopUp={setShowDeletePopUp}
					onMutateSuccess={() => { onMutateSuccess(); handleClosePopUp(); }}
					langYes={language?.langYes}
					langNo={language?.langNo}
				/> : null}
			<div className={
				css(
					styles['create-view-exam-container'],
					hide ? styles['hide'] : ''
				)
			}>
				{
					queryData.isLoading ? <Loading /> : null
				}
				{
					isPending ? <Loading /> : null
				}
				<div className={
					css(
						styles['create-view-exam-form'],
						hide ? styles['hide'] : ''
					)
				}>
					<div className={styles['header']}>
						<h2 className={styles['title']}>{language?.exam}</h2>
						<div className={styles['esc-button']}
							onClick={handleClosePopUp}
						>
							<RxCross2 />
						</div>
					</div>
					<div className={styles['form-content']}>
						{
							queryData.data ?
								<form
									onSubmit={e => { mutate(e); }}
									className={styles['form-data']}>
									<div className={styles['group-inputs']}>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='name'>{language?.name}</label>
											<input
												id='name'
												name='name'
												defaultValue={queryData.data.name}
												disabled={disabledUpdate}
												className={css(appStyles['input-d'], styles['input-item'])}
												type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='exam_date'>{language?.examDate}</label>
											<Datetime
												initialValue={new Date(queryData.data.examDate)}
												renderMonth={renderMonth}
												inputProps={
													{
														id: 'exam_date',
														name: 'exam_date',
														disabled: disabledUpdate,
														className: css(appStyles['input-d'], styles['input-item'])
													}
												}
												closeOnSelect={true}
												timeFormat={true}
											/>
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='exam_time'>{language?.examTime}</label>
											<input
												onBeforeInput={(e: React.CompositionEvent<HTMLInputElement>) => {
													if (e.data === '.') e.preventDefault();
												}}
												id='exam_time'
												name='exam_time'
												defaultValue={queryData.data.examTime}
												disabled={disabledUpdate}
												min={0}
												max={60 * 60 * 24}
												className={css(appStyles['input-d'], styles['input-item'])}
												type='number'
											/>
										</div>
										{
											queryData.data ?
												<>
													<div className={styles['wrap-item']}>
														<span>{language?.totalQuestions}: {queryData.data.questionsCount}</span>
													</div>
													<div className={css(styles['wrap-item'], styles['data-container'])}>
														{/* <label>{language?.supervisors}</label> */}
														{
															permissions.has('user_view') ?
																<input
																	placeholder={language?.search}
																	onInput={e => {
																		setQueryUser(e.currentTarget.value);
																	}}
																	className={css(appStyles['input-d'], styles['input-item'])}
																	type='text' />
																: null
														}
														<label>{language?.supervisors}</label>
														<ul className={styles['joined-supervisors-container']}>
															{
																supervisors.map((supervisor, index) => {
																	return (
																		<li
																			className={styles['joined-supervisor']}
																			key={`joined-supervisor-${supervisor.id}`}
																		>
																			<div>
																				<span>
																					{languageUtils.getFullName(supervisor.firstName, supervisor.lastName)}
																				</span>
																				{/* <span>
																			{supervisor.faculty?.name}
																		</span> */}
																				<span
																					style={{ height: '20px' }}
																					onClick={() => {
																						if (!permissions.has('exam_update')) return;
																						const newSupervisors = structuredClone(supervisors);
																						newSupervisors.splice(index, 1);
																						setSupervisors(newSupervisors);
																					}}
																				>
																					<RxCross2 />
																				</span>
																			</div>
																		</li>
																	);
																})
															}
														</ul>
														{
															permissions.has('user_view') ?
																<>
																	<label>{language?.allSupervisors}</label>
																	<ul className={styles['all-supervisor-conatiner']}>
																		{userQueryData.data ?
																			userQueryData.data
																				.filter(user => !supervisors.find(supervisor => supervisor.id === user.id))
																				.map(user => (
																					<li
																						onClick={() => {
																							const newSupervisors = structuredClone(supervisors);
																							newSupervisors.push(user);
																							setSupervisors(newSupervisors);
																						}}
																						className={css(appStyles['dashboard-card-d'], styles['card'])}
																						key={`user-${user.id}`}
																					>
																						<div className={styles['card-left']}>
																							<span>{languageUtils.getFullName(user.firstName, user.lastName)}</span>
																							<span>{user.faculty?.name}</span>
																						</div>
																					</li>
																				)) : null
																		}
																	</ul>
																</> : null
														}
													</div>
												</> : null
										}
									</div>
									{
										permissions.hasAnyFormList(['exam_update', 'exam_delete']) && !isExamStarted() ?
											<div className={styles['action-items']}>
												{
													permissions.has('exam_update') && !isExamStarted() ?
														<button name='save'
															className={
																css(
																	appStyles['action-item-d'],
																	isPending ? appStyles['button-submitting'] : ''
																)
															}
														><FiSave />{language?.save}
														</button> : null
												}
												{
													permissions.has('exam_delete') && !isExamStarted() ?
														<button
															type='button'
															onClick={() => {
																setShowDeletePopUp(true);
															}}
															className={appStyles['action-item-white-border-red-d']}>
															<MdDeleteOutline /> {language?.delete}
														</button> : null
												}
											</div>
											: null
									}
								</form>
								: null
						}
					</div>
				</div>
			</div>
		</>
	);
}

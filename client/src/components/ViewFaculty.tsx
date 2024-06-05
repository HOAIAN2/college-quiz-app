import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import appStyles from '../App.module.css';
import { apiGetFacultyById, apiUpdateFaculty } from '../api/faculty';
import { apiAutoCompleteUser } from '../api/user';
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/global/ViewModel.module.css';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';
import languageUtils from '../utils/languageUtils';
import CustomDataList from './CustomDataList';
import Loading from './Loading';

type ViewFacultyProps = {
	id: number;
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ViewFaculty({
	id,
	onMutateSuccess,
	setShowPopUp
}: ViewFacultyProps) {
	const [hide, setHide] = useState(true);
	const language = useLanguage('component.view_faculty');
	const { permissions } = useAppContext();
	const [queryUser, setQueryUser] = useState('');
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE);
	const queryClient = useQueryClient();
	const disabledUpdate = !permissions.has('faculty_update');
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, TRANSITION_TIMING_FAST);
	};
	const formUtils = createFormUtils(styles);
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.FACULTY_DETAIL, { id: id }],
		queryFn: () => apiGetFacultyById(id)
	});
	const userQueryData = useQuery({
		queryKey: [QUERY_KEYS.AUTO_COMPLETE_USER, { search: debounceQueryUser }],
		queryFn: () => apiAutoCompleteUser('teacher', debounceQueryUser),
		enabled: debounceQueryUser && permissions.has('user_view') ? true : false
	});
	const handleUpdateFaculty = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error');
			formUtils.getParentElement(node)?.removeAttribute('data-error');
		});
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		await apiUpdateFaculty(formData, id);
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateFaculty,
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		setHide(false);
		return () => {
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.FACULTY_DETAIL, { id: id }] });
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTO_COMPLETE_USER] });
		};
	}, [id, queryClient]);
	return (
		<div
			className={
				css(
					styles['view-model-container'],
					hide ? styles['hide'] : ''
				)
			}>
			{
				isPending ? <Loading /> : null
			}
			<div
				className={
					css(
						styles['view-model-form'],
						hide ? styles['hide'] : ''
					)
				}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{queryData.data?.name}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<>
					{
						queryData.isLoading ? <Loading /> : null
					}
					<div className={styles['form-content']}>
						{
							queryData.data ? (
								<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
									mutate(e);
								}}
									onInput={(e) => { formUtils.handleOnInput(e); }}
									className={styles['form-data']}>
									<div className={styles['group-inputs']
									}>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
											<input
												id='shortcode'
												disabled={disabledUpdate}
												defaultValue={queryData.data.shortcode}
												name='shortcode'
												className={css(appStyles['input-d'], styles['input-item'])}
												type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label className={styles['required']} htmlFor='name'>{language?.name}</label>
											<input
												id='name'
												disabled={disabledUpdate}
												defaultValue={queryData.data.name}
												name='name'
												className={css(appStyles['input-d'], styles['input-item'])}
												type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='email'>{language?.email}</label>
											<input
												id='email'
												disabled={disabledUpdate}
												defaultValue={queryData.data.email || ''}
												name='email'
												className={css(appStyles['input-d'], styles['input-item'])}
												type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='phone_number'>{language?.phoneNumber}</label>
											<input
												id='phone_number'
												disabled={disabledUpdate}
												defaultValue={queryData.data.phoneNumber || ''}
												name='phone_number'
												className={css(appStyles['input-d'], styles['input-item'])}
												type='text' />
										</div>
										<div className={styles['wrap-item']}>
											<label htmlFor='leader_id'>{language?.leader}</label>
											<CustomDataList
												name='leader_id'
												defaultOption={
													{
														label: languageUtils.getFullName(queryData.data.leader?.firstName, queryData.data.leader?.lastName),
														value: queryData.data.leader ? String(queryData.data.leader.id) : ''
													}
												}
												disabled={disabledUpdate}
												onInput={e => { setQueryUser(e.currentTarget.value); }}
												options={userQueryData.data ? userQueryData.data.map(item => {
													return {
														label: languageUtils.getFullName(item.firstName, item.lastName),
														value: String(item.id)
													};
												}) : []}
												className={styles['custom-select']}
											/>
										</div>
									</div>
									{
										permissions.has('faculty_update') ?
											<div className={styles['action-items']}>
												<button name='save'
													className={
														css(
															appStyles['action-item-d'],
															isPending ? appStyles['button-submitting'] : ''
														)
													}
												><FiSave />{language?.save}
												</button>
											</div>
											: null
									}
								</form>
							) : null
						}
					</div>
				</>
			</div>
		</div>
	);
}

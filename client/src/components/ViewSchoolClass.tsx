import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import appStyles from '../App.module.css';
import { apiAutoCompleteFaculty } from '../api/faculty';
import { apiGetSchoolClassById, apiUpdateSchoolClass } from '../api/school-class';
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/global/ViewModel.module.css';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';
import CustomDataList from './CustomDataList';
import Loading from './Loading';

type ViewSchoolClassProps = {
	id: number;
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ViewSchoolClass({
	id,
	onMutateSuccess,
	setShowPopUp
}: ViewSchoolClassProps) {
	const [hide, setHide] = useState(true);
	const language = useLanguage('component.view_school_class');
	const { permissions } = useAppContext();
	const [queryFaculty, setQueryFaculty] = useState('');
	const debounceQueryFaculty = useDebounce(queryFaculty, AUTO_COMPLETE_DEBOUNCE);
	const queryClient = useQueryClient();
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, TRANSITION_TIMING_FAST);
	};
	const disabledUpdate = !permissions.has('school_class_update');
	const formUtils = createFormUtils(styles);
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.SCHOOL_CLASS_DETAIL, id],
		queryFn: () => apiGetSchoolClassById(id)
	});
	const facultyQueryData = useQuery({
		queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY, { search: debounceQueryFaculty }],
		queryFn: () => apiAutoCompleteFaculty(debounceQueryFaculty),
		enabled: debounceQueryFaculty && permissions.has('faculty_view') ? true : false
	});
	const handleUpdateSchoolClass = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error');
			formUtils.getParentElement(node)?.removeAttribute('data-error');
		});
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		await apiUpdateSchoolClass(formData, id);
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateSchoolClass,
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		setHide(false);
		return () => {
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.SCHOOL_CLASS_DETAIL, { id: id }] });
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY] });
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
									<div className={styles['group-inputs']}>
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
											<label className={styles['required']} htmlFor='faculty_id'>{language?.faculty}</label>
											<CustomDataList
												name='faculty_id'
												disabled={disabledUpdate}
												defaultOption={
													{
														label: queryData.data.faculty?.name,
														value: queryData.data.faculty ? String(queryData.data.faculty.id) : ''
													}}
												onInput={e => { setQueryFaculty(e.currentTarget.value); }}
												options={facultyQueryData.data ? facultyQueryData.data.map(item => {
													return {
														label: item.name,
														value: String(item.id)
													};
												}) : []}
											/>
										</div>
									</div>
									{
										permissions.has('school_class_update') ?
											<div className={styles['action-items']}>
												<button name='save'
													className={
														css(
															appStyles['action-item-d'],
															isPending ? appStyles['button-submitting'] : ''
														)
													}>
													<FiSave />
													{language?.save}
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

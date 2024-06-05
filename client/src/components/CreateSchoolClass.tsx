import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import appStyles from '../App.module.css';
import { apiAutoCompleteFaculty } from '../api/faculty';
import { apiCreateSchoolClass } from '../api/school-class';
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import QUERY_KEYS from '../constants/query-keys';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/global/CreateModel.module.css';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';
import CustomDataList from './CustomDataList';
import Loading from './Loading';

type CreateSchoolClassProps = {
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function CreateSchoolClass({
	onMutateSuccess,
	setShowPopUp
}: CreateSchoolClassProps) {
	const language = useLanguage('component.create_school_class');
	const [hide, setHide] = useState(true);
	const [queryFaculty, setQueryFaculty] = useState('');
	const debounceQueryFaculty = useDebounce(queryFaculty, AUTO_COMPLETE_DEBOUNCE);
	const queryClient = useQueryClient();
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, TRANSITION_TIMING_FAST);
	};
	const formUtils = createFormUtils(styles);
	const facultyQueryData = useQuery({
		queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY, { search: debounceQueryFaculty }],
		queryFn: () => apiAutoCompleteFaculty(debounceQueryFaculty),
		enabled: debounceQueryFaculty ? true : false
	});
	const handleCreateFaculty = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error');
			formUtils.getParentElement(node)?.removeAttribute('data-error');
		});
		const submitter = e.nativeEvent.submitter as HTMLButtonElement;
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		await apiCreateSchoolClass(formData);
		if (submitter.name === 'save') handleClosePopUp();
		else form.reset();
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleCreateFaculty,
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		setHide(false);
		return () => {
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY] });
		};
	}, [queryClient]);
	return (
		<div className={
			css(
				styles['create-model-container'],
				hide ? styles['hide'] : ''
			)
		}>
			{
				isPending ? <Loading /> : null
			}
			<div className={
				css(
					styles['create-model-form'],
					hide ? styles['hide'] : ''
				)
			}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{language?.create}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div className={styles['form-content']}>
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
									name='shortcode'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='name'>{language?.name}</label>
								<input
									id='name'
									name='name'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='faculty_id'>{language?.faculty}</label>
								<CustomDataList
									name='faculty_id'
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
						<div className={styles['action-items']}>
							<button name='save'
								className={
									css(
										appStyles['action-item-d'],
										isPending ? appStyles['button-submitting'] : ''
									)}>
								<FiSave />{language?.save}
							</button>
							<button name='save-more'
								className={
									css(
										appStyles['action-item-white-d'],
										isPending ? appStyles['button-submitting'] : ''
									)
								}>
								<FiSave />{language?.saveMore}
							</button>
						</div>
					</form>
				</div>
			</div >
		</div >
	);
}

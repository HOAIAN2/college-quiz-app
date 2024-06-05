import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import Datetime from 'react-datetime';
import { FiSave } from 'react-icons/fi';
import {
	RxCross2
} from 'react-icons/rx';
import appStyles from '../App.module.css';
import { apiAutoCompleteFaculty } from '../api/faculty';
import { apiAutoCompleteSchoolClass } from '../api/school-class';
import { apiCreateUser } from '../api/user';
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import QUERY_KEYS from '../constants/query-keys';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import { RoleName } from '../models/role';
import styles from '../styles/global/CreateModel.module.css';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';
import renderMonth from '../utils/renderMonth';
import CustomDataList from './CustomDataList';
import CustomSelect from './CustomSelect';
import Loading from './Loading';

type CreateUserProps = {
	role: RoleName;
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function CreateUser({
	role,
	onMutateSuccess,
	setShowPopUp
}: CreateUserProps) {
	const language = useLanguage('component.create_user');
	const [hide, setHide] = useState(true);
	const [queryClass, setQueryClass] = useState('');
	const [queryFaculty, setQueryFaculty] = useState('');
	const debounceQueryClass = useDebounce(queryClass, AUTO_COMPLETE_DEBOUNCE);
	const debounceQueryFaculty = useDebounce(queryFaculty, AUTO_COMPLETE_DEBOUNCE);
	const queryClient = useQueryClient();
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, TRANSITION_TIMING_FAST);
	};
	const formUtils = createFormUtils(styles);
	const classQueryData = useQuery({
		queryKey: [QUERY_KEYS.AUTO_COMPLETE_SCHOOL_CLASS, { search: debounceQueryClass }],
		queryFn: () => apiAutoCompleteSchoolClass(debounceQueryClass),
		enabled: debounceQueryClass ? true : false
	});
	const facultyQueryData = useQuery({
		queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY, { search: debounceQueryFaculty }],
		queryFn: () => apiAutoCompleteFaculty(debounceQueryFaculty),
		enabled: debounceQueryFaculty ? true : false
	});
	const handleCreateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
			node.classList.remove('error');
			formUtils.getParentElement(node)?.removeAttribute('data-error');
		});
		const submitter = e.nativeEvent.submitter as HTMLButtonElement;
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		formData.append('role', role !== undefined ? role : 'student');
		await apiCreateUser(formData);
		if (submitter.name === 'save') handleClosePopUp();
		else form.reset();
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleCreateUser,
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: onMutateSuccess
	});
	const options = [
		{ value: 'male', label: language?.genders.male },
		{ value: 'female', label: language?.genders.female },
	];
	useEffect(() => {
		setHide(false);
		return () => {
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY] });
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTO_COMPLETE_SCHOOL_CLASS] });
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
					<h2 className={styles['title']}>{
						[
							language?.create,
							language && role ? language[role] : ''
						].join(' ')
					}</h2>
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
								<label className={styles['required']} htmlFor='email'>{language?.email}</label>
								<input
									id='email'
									name='email'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label htmlFor='phone_number'>{language?.phoneNumber}</label>
								<input
									id='phone_number'
									name='phone_number'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='first_name'>{language?.firstName}</label>
								<input
									id='first_name'
									name='first_name'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='last_name'>{language?.lastName}</label>
								<input
									id='last_name'
									name='last_name'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
								<input
									id='shortcode'
									name='shortcode'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							{role === 'student' ?
								<div style={{ zIndex: 2 }} className={styles['wrap-item']}>
									<label className={styles['required']} htmlFor='school_class_id'>{language?.class}</label>
									<CustomDataList
										name='school_class_id'
										onInput={e => { setQueryClass(e.currentTarget.value); }}
										options={classQueryData.data ? classQueryData.data.map(item => {
											return {
												label: item.name,
												value: String(item.id)
											};
										}) : []}
									/>
								</div>
								: role === 'teacher' ?
									<div style={{ zIndex: 2 }} className={styles['wrap-item']}>
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
									: null
							}
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor=''>{language?.genders.gender}</label>
								<CustomSelect
									name='gender'
									defaultOption={options[0]}
									options={options}
									className={styles['custom-select']}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='address'>{language?.address}</label>
								<input
									id='address'
									name='address'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='text' />
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='birth_date'>{language?.birthDate}</label>
								<Datetime
									initialValue={new Date()}
									renderMonth={renderMonth}
									inputProps={
										{
											id: 'birth_date',
											name: 'birth_date',
											className: css(appStyles['input-d'], styles['input-item'])
										}
									}
									closeOnSelect={true}
									timeFormat={false}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='password'>{language?.password}</label>
								<input
									id='password'
									name='password'
									className={css(appStyles['input-d'], styles['input-item'])}
									type='password' />
							</div>
						</div>
						<div className={styles['action-items']}>
							<button name='save'
								className={
									css(
										appStyles['action-item-d'],
										isPending ? appStyles['button-submitting'] : ''
									)
								}><FiSave />{language?.save}</button>
							<button name='save-more'
								className={
									css(
										appStyles['action-item-white-d'],
										isPending ? appStyles['button-submitting'] : ''
									)
								}
							><FiSave />{language?.saveMore}</button>
						</div>
					</form>
				</div>
			</div >
		</div >
	);
}

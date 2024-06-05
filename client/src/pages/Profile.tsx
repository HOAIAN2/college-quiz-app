import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import Datetime from 'react-datetime';
import { FiSave } from 'react-icons/fi';
import { PiKey } from 'react-icons/pi';
import appStyles from '../App.module.css';
import { apiGetUser, apiUpdateUser } from '../api/user';
import ChangePassword from '../components/ChangePassword';
import CustomSelect from '../components/CustomSelect';
import Loading from '../components/Loading';
import SuspenseLoading from '../components/SuspenseLoading';
import QUERY_KEYS from '../constants/query-keys';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/Profile.module.css';
import createFormUtils from '../utils/createFormUtils';
import css from '../utils/css';
import languageUtils from '../utils/languageUtils';
import renderMonth from '../utils/renderMonth';

export default function Profile() {
	const language = useLanguage('page.profile');
	const { user, permissions } = useAppContext();
	const [showChangePasswordPopUp, setShowChangePasswordPopUp] = useState(false);
	const queryClient = useQueryClient();
	const formUtils = createFormUtils(styles);
	const disabledUpdate = !permissions.has('user_update');
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.PAGE_PROFILE],
		queryFn: apiGetUser,
	});
	const handleUpdateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		document.querySelector(`.${styles['form-data']}`)?.querySelectorAll('input[name]').forEach(node => {
			const element = node as HTMLInputElement;
			element.classList.remove('error');
			formUtils.getParentElement(element)?.removeAttribute('data-error');
		});
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		queryData.data && await apiUpdateUser(formData, queryData.data.user.id);
	};
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateUser,
		onError: (error: object) => { formUtils.showFormError(error); },
		onSuccess: () => {
			apiGetUser()
				.then((data) => {
					user.setUser(data.user);
					permissions.setItems(data.permissions);
				});
		}
	});
	const genderOptions = [
		{ value: 'male', label: language?.genders.male },
		{ value: 'female', label: language?.genders.female },
	];
	useEffect(() => {
		return () => {
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.PAGE_PROFILE] });
		};
	}, [queryClient]);
	if (!queryData.data) return <SuspenseLoading />;
	return (
		<>
			{showChangePasswordPopUp === true ?
				<ChangePassword
					setShowPopup={setShowChangePasswordPopUp}
				/> : null}
			<main className={css(appStyles['dashboard-d'], styles['profile-content'])}>
				{
					isPending ? <Loading /> : null
				}
				<section className={styles['section']}>
					<div className={styles['header']}>
						<h2 className={styles['title']}>{languageUtils.getFullName(queryData.data.user.firstName, queryData.data.user.lastName)}</h2>
					</div>
					<form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
						mutate(e);
					}}
						onInput={e => { formUtils.handleOnInput(e); }}
						className={styles['form-data']}>
						<input name='is_active' defaultValue='1' hidden />
						<div className={styles['group-inputs']}>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='email'>{language?.email}</label>
								<input
									id='email'
									disabled={disabledUpdate}
									defaultValue={queryData.data.user.email}
									name='email'
									className={css(appStyles['input-d'], styles['input-item'])}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label htmlFor='phone_number'>{language?.phoneNumber}</label>
								<input
									id='phone_number'
									disabled={disabledUpdate}
									defaultValue={queryData.data.user.phoneNumber || ''}
									name='phone_number'
									className={css(appStyles['input-d'], styles['input-item'])}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='first_name'>{language?.firstName}</label>
								<input
									id='first_name'
									disabled={disabledUpdate}
									defaultValue={queryData.data.user.firstName}
									name='first_name'
									className={css(appStyles['input-d'], styles['input-item'])}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='last_name'>{language?.lastName}</label>
								<input
									id='last_name'
									disabled={disabledUpdate}
									defaultValue={queryData.data.user.lastName}
									name='last_name'
									className={css(appStyles['input-d'], styles['input-item'])}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='shortcode'>{language?.shortcode}</label>
								<input
									id='shortcode'
									disabled={disabledUpdate}
									defaultValue={queryData.data.user.shortcode}
									name='shortcode'
									className={css(appStyles['input-d'], styles['input-item'])}
								/>
							</div>
							{queryData.data?.user.role.name === 'student' ?
								<div className={styles['wrap-item']}>
									<label className={styles['required']} htmlFor='school_class'>{language?.class}</label>
									<input
										id='school_class'
										disabled={disabledUpdate}
										defaultValue={queryData.data.user.schoolClass?.shortcode || ''}
										name='school_class'
										className={css(appStyles['input-d'], styles['input-item'])}
									/>
								</div> : queryData.data?.user.role.name === 'teacher'
									? <div className={styles['wrap-item']}>
										<label className={styles['required']} htmlFor='faculty'>{language?.faculty}</label>
										<input
											id='faculty'
											disabled={disabledUpdate}
											defaultValue={queryData.data.user.faculty?.shortcode || ''}
											name='faculty'
											className={css(appStyles['input-d'], styles['input-item'])}
										/>
									</div> : null
							}
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor=''>{language?.genders.gender}</label>
								<CustomSelect
									name='gender'
									defaultOption={
										queryData.data.user.gender === 'male'
											? genderOptions[0] : genderOptions[1]
									}
									options={genderOptions}
									disabled={disabledUpdate}
									className={styles['custom-select']}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='address'>{language?.address}</label>
								<input
									id='address'
									disabled={disabledUpdate}
									defaultValue={queryData.data.user.address}
									name='address'
									className={css(appStyles['input-d'], styles['input-item'])}
								/>
							</div>
							<div className={styles['wrap-item']}>
								<label className={styles['required']} htmlFor='birth_date'>{language?.birthDate}</label>
								<Datetime
									initialValue={new Date(queryData.data.user.birthDate)}
									renderMonth={renderMonth}
									inputProps={
										{
											id: 'birth_date',
											disabled: disabledUpdate,
											name: 'birth_date',
											className: css(appStyles['input-d'], styles['input-item'])
										}
									}
									closeOnSelect={true}
									timeFormat={false}
								/>
							</div>
						</div>
						{
							permissions.has('user_update') ?
								<div className={styles['action-items']}>
									<button name='save'
										className={
											css(
												appStyles['action-item-d'],
												isPending ? appStyles['button-submitting'] : ''
											)
										}
									><FiSave /> {language?.save}</button>
								</div>
								: null
						}
					</form>
				</section>
				<section className={styles['section']}>
					<div className={styles['header']}>
						<h2 className={styles['title']}>{language?.otherSection.other}</h2>
					</div>
					<div className={styles['section-content']} >
						<button
							className={appStyles['action-item-d']}
							onClick={() => { setShowChangePasswordPopUp(true); }}>
							<PiKey />{language?.otherSection.changePassword}
						</button>
					</div>
				</section>
			</main>
		</>
	);
}

import appStyles from '~styles/App.module.css';
import styles from '~styles/ViewModel.module.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { Link } from 'react-router';
import { apiAutoCompleteFaculty } from '~api/faculty';
import { apiAutoCompleteSchoolClass } from '~api/school-class';
import { apiGetUserById, apiUpdateUser } from '~api/user';
import CustomDataList from '~components/CustomDataList';
import CustomSelect from '~components/CustomSelect';
import Loading from '~components/Loading';
import { AUTO_COMPLETE_DEBOUNCE } from '~config/env';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import createFormUtils from '~utils/create-form-utils';
import css from '~utils/css';
import dateFormat from '~utils/date-format';
import languageUtils from '~utils/language-utils';

type ViewUserProps = {
    id: number;
    onMutateSuccess: () => void;
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ViewUser({
    id,
    onMutateSuccess,
    setShowPopUp
}: ViewUserProps) {
    const language = useLanguage('component.view_user');
    const { permissions } = useAppContext();
    const [queryClass, setQueryClass] = useState('');
    const [queryFaculty, setQueryFaculty] = useState('');
    const [disabledUpdate, setDisabledUpdate] = useState(!permissions.has('user_update'));
    const debouceQueryClass = useDebounce(queryClass, AUTO_COMPLETE_DEBOUNCE);
    const debounceQueryFaculty = useDebounce(queryFaculty, AUTO_COMPLETE_DEBOUNCE);
    const queryClient = useQueryClient();
    const handleClosePopUp = () => {
        setShowPopUp(false);
    };
    const formUtils = createFormUtils(styles);
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.USER_DETAIL, { id: id }],
        queryFn: () => apiGetUserById(id)
    });
    const classQueryData = useQuery({
        queryKey: [QUERY_KEYS.AUTO_COMPLETE_SCHOOL_CLASS, { search: debouceQueryClass }],
        queryFn: () => apiAutoCompleteSchoolClass(debouceQueryClass),
        enabled: debouceQueryClass && permissions.has('school_class_view') ? true : false
    });
    const facultyQueryData = useQuery({
        queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY, { search: debounceQueryFaculty }],
        queryFn: () => apiAutoCompleteFaculty(debounceQueryFaculty),
        enabled: debounceQueryFaculty && permissions.has('faculty_view') ? true : false
    });
    const handleUpdateUser = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        document.querySelector(`.${styles.formData}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
            node.classList.remove('error');
            formUtils.getParentElement(node)?.removeAttribute('data-error');
        });
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await apiUpdateUser(formData, id);
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateUser,
        onError: (error) => { formUtils.showFormError(error); },
        onSuccess: onMutateSuccess
    });
    const genderOptions = [
        { value: 'male', label: language?.genders.male },
        { value: 'female', label: language?.genders.female },
    ];
    const statusOptions = [
        { value: '1', label: language?.status.active },
        { value: '0', label: language?.status.inactive },
    ];
    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.USER_DETAIL, { id: id }] });
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY] });
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTO_COMPLETE_SCHOOL_CLASS] });
        };
    }, [queryClient, id]);
    useEffect(() => {
        if (!queryData.data) return;
        if (queryData.data.role.name === 'admin') {
            setDisabledUpdate(true);
        }
    }, [queryData.data]);
    return (
        <div
            className={
                css(
                    styles.viewModelContainer,
                )
            }>
            {
                isPending ? <Loading /> : null
            }
            <div
                className={
                    css(
                        styles.viewModelForm,
                    )
                }>
                <div className={styles.header}>
                    <h2 className={styles.title}>{languageUtils.getFullName(queryData.data?.firstName, queryData.data?.lastName)}</h2>
                    <div className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <>
                    {
                        queryData.isLoading ? <Loading /> : null
                    }
                    <div className={styles.formContent}>
                        {
                            queryData.data ? (
                                <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                                    mutate(e);
                                }}
                                    onInput={(e) => { formUtils.handleOnInput(e); }}
                                    className={styles.formData}>
                                    <div>
                                        <div className={styles.groupInputs}>
                                            <div className={styles.wrapItem}>
                                                <label className={appStyles.required} htmlFor='email'>{language?.email}</label>
                                                <input
                                                    id='email'
                                                    disabled={disabledUpdate}
                                                    defaultValue={queryData.data.email}
                                                    name='email'
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    type='text' />
                                            </div>
                                            <div className={styles.wrapItem}>
                                                <label htmlFor='phone_number'>{language?.phoneNumber}</label>
                                                <input
                                                    id='phone_number'
                                                    disabled={disabledUpdate}
                                                    defaultValue={queryData.data.phoneNumber || ''}
                                                    name='phone_number'
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    type='text' />
                                            </div>
                                            <div className={styles.wrapItem}>
                                                <label className={appStyles.required} htmlFor='first_name'>{language?.firstName}</label>
                                                <input
                                                    id='first_name'
                                                    disabled={disabledUpdate}
                                                    defaultValue={queryData.data.firstName}
                                                    name='first_name'
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    type='text' />
                                            </div>
                                            <div className={styles.wrapItem}>
                                                <label className={appStyles.required} htmlFor='last_name'>{language?.lastName}</label>
                                                <input
                                                    id='last_name'
                                                    disabled={disabledUpdate}
                                                    defaultValue={queryData.data.lastName}
                                                    name='last_name'
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    type='text' />
                                            </div>
                                            <div className={styles.wrapItem}>
                                                <label className={appStyles.required} htmlFor='shortcode'>{language?.shortcode}</label>
                                                <input
                                                    id='shortcode'
                                                    disabled={disabledUpdate}
                                                    defaultValue={queryData.data.shortcode}
                                                    name='shortcode'
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    type='text' />
                                            </div>
                                            {queryData.data.role.name === 'student' ?
                                                <div style={{ zIndex: 3 }} className={styles.wrapItem}>
                                                    <label className={appStyles.required} htmlFor='school_class_id'>{language?.class}</label>
                                                    <CustomDataList
                                                        name='school_class_id'
                                                        defaultOption={
                                                            {
                                                                label: queryData.data.schoolClass?.name,
                                                                value: queryData.data.schoolClass ? String(queryData.data.schoolClass.id) : ''
                                                            }
                                                        }
                                                        onInput={e => { setQueryClass(e.currentTarget.value); }}
                                                        options={classQueryData.data ? classQueryData.data.map(item => {
                                                            return {
                                                                label: item.name,
                                                                value: String(item.id)
                                                            };
                                                        }) : []}
                                                        disabled={disabledUpdate}
                                                    />
                                                </div>
                                                : queryData.data.role.name === 'teacher' ?
                                                    <div style={{ zIndex: 3 }} className={styles.wrapItem}>
                                                        <label className={appStyles.required} htmlFor='faculty_id'>{language?.faculty}</label>
                                                        <CustomDataList
                                                            name='faculty_id'
                                                            defaultOption={
                                                                {
                                                                    label: queryData.data.faculty?.name,
                                                                    value: queryData.data.faculty ? String(queryData.data.faculty.id) : ''
                                                                }
                                                            }
                                                            onInput={e => { setQueryFaculty(e.currentTarget.value); }}
                                                            options={facultyQueryData.data ? facultyQueryData.data.map(item => {
                                                                return {
                                                                    label: item.name,
                                                                    value: String(item.id)
                                                                };
                                                            }) : []}
                                                            disabled={disabledUpdate}
                                                        />
                                                    </div>
                                                    : null
                                            }
                                            <div
                                                className={styles.wrapItem}
                                                style={{ zIndex: 2 }}>
                                                <label className={appStyles.required} htmlFor=''>{language?.genders.gender}</label>
                                                <CustomSelect
                                                    name='gender'
                                                    defaultOption={
                                                        queryData.data.gender === 'male'
                                                            ? genderOptions[0] : genderOptions[1]
                                                    }
                                                    disabled={disabledUpdate}
                                                    options={genderOptions}
                                                    className={styles.customSelect}
                                                />
                                            </div>
                                            <div className={styles.wrapItem}>
                                                <label className={appStyles.required} htmlFor='address'>{language?.address}</label>
                                                <input
                                                    id='address'
                                                    disabled={disabledUpdate}
                                                    defaultValue={queryData.data.address}
                                                    name='address'
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    type='text' />
                                            </div>
                                            <div className={styles.wrapItem}>
                                                <label className={appStyles.required} htmlFor='birth_date'>{language?.birthDate}</label>
                                                <input
                                                    defaultValue={dateFormat.toDateString(new Date(queryData.data.birthDate))}
                                                    max={dateFormat.toDateString(new Date())}
                                                    type='date'
                                                    id='birth_date'
                                                    name='birth_date'
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    disabled={disabledUpdate}
                                                />
                                            </div>
                                            <div className={styles.wrapItem}>
                                                <label className={appStyles.required} htmlFor=''>{language?.status.accountStatus}</label>
                                                <CustomSelect
                                                    name='is_active'
                                                    defaultOption={
                                                        queryData.data.isActive
                                                            ? statusOptions[0] : statusOptions[1]
                                                    }
                                                    disabled={disabledUpdate}
                                                    options={statusOptions}
                                                    className={styles.customSelect}
                                                />
                                            </div>
                                            <div className={styles.wrapItem}>
                                                <label htmlFor='password'>{language?.password}</label>
                                                <input
                                                    id='password'
                                                    disabled={disabledUpdate}
                                                    placeholder={language?.leaveBlank}
                                                    name='password'
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    type='password' />
                                            </div>
                                        </div>
                                        {
                                            queryData.data.role.name === 'student' ?
                                                <section style={{
                                                    borderTop: '1px solid var(--color-gray)',
                                                    paddingTop: '10px',
                                                }}>
                                                    <Link className={styles.link} to={`/exam-results/students/${queryData.data.id}`}>{language?.examResults}</Link>
                                                </section>
                                                : null
                                        }
                                    </div>
                                    {
                                        permissions.has('user_update') && !disabledUpdate ?
                                            <div className={styles.actionItems}>
                                                <button name='save'
                                                    className={
                                                        css(
                                                            appStyles.actionItem,
                                                            isPending ? appStyles.buttonSubmitting : ''
                                                        )
                                                    }
                                                ><FiSave />{language?.save}</button>
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

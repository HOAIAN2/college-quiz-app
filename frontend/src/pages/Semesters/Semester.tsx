import appStyles from '~styles/App.module.css';
import styles from './styles/Semester.module.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { apiDeleteSemester, apiGetSemesterById, apiUpdateSemester } from '~api/semester';
import DatePicker from '~components/DatePicker';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import createFormUtils from '~utils/createFormUtils';
import css from '~utils/css';

export default function Semester() {
    const { permissions } = useAppContext();
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const language = useLanguage('page.semester');
    const { id } = useParams();
    const formUtils = createFormUtils(styles);
    const disabledUpdate = !permissions.has('semester_update');
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.PAGE_SEMESTER, { id: id }],
        queryFn: () => apiGetSemesterById(String(id)),
        enabled: permissions.has('semester_view')
    });
    const handleUpdateSemester = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        document.querySelector(`.${styles.formData}`)?.querySelectorAll<HTMLInputElement>('input[name]').forEach(node => {
            node.classList.remove('error');
            formUtils.getParentElement(node)?.removeAttribute('data-error');
        });
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await apiUpdateSemester(formData, String(id));
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateSemester,
        onError: (error) => { formUtils.showFormError(error); },
    });
    const handleDeleteSemester = async () => {
        await apiDeleteSemester(String(id));
    };
    const onMutateSuccess = () => {
        [QUERY_KEYS.PAGE_SEMESTERS].forEach(key => {
            queryClient.refetchQueries({ queryKey: [key] });
        });
        navigate('/semesters');
    };
    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.PAGE_SEMESTER, { id: id }] });
        };
    }, [id, queryClient]);
    if (!permissions.has('semester_view')) return <Navigate to='/' />;
    return (
        <>
            {showDeletePopUp === true ?
                <YesNoPopUp
                    message={language?.deleteMessage || ''}
                    mutateFunction={handleDeleteSemester}
                    setShowPopUp={setShowDeletePopUp}
                    onMutateSuccess={onMutateSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            <main className={css(appStyles.dashboard, styles.pageContent)}>
                {
                    queryData.isLoading ? <Loading /> : null
                }
                {
                    isPending ? <Loading /> : null
                }
                {
                    queryData.data ?
                        <>
                            <section className={styles.formContent}>
                                <div className={styles.header}>
                                    <h2 className={styles.title}>{queryData.data.name}</h2>
                                </div>
                                <form onSubmit={(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
                                    mutate(e);
                                }}
                                    onInput={e => { formUtils.handleOnInput(e); }}
                                    className={styles.formData}>
                                    <input name='is_active' defaultValue='1' hidden />
                                    <div className={styles.groupInputs}>
                                        <div className={styles.wrapItem}>
                                            <label className={appStyles.required} htmlFor='name'>{language?.name}</label>
                                            <input
                                                id='name'
                                                name='name'
                                                disabled={disabledUpdate}
                                                defaultValue={queryData.data.name}
                                                className={css(appStyles.input, styles.inputItem)}
                                                type='text' />
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label className={appStyles.required} htmlFor='start_date'>{language?.startDate}</label>
                                            <DatePicker
                                                initialValue={new Date(queryData.data.startDate)}
                                                inputProps={
                                                    {
                                                        id: 'start_date',
                                                        name: 'start_date',
                                                        className: css(appStyles.input, styles.inputItem),
                                                        disabled: disabledUpdate
                                                    }
                                                }
                                                closeOnSelect={true}
                                                timeFormat={false}
                                            />
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label className={appStyles.required} htmlFor='end_date'>{language?.endDate}</label>
                                            <DatePicker
                                                initialValue={new Date(queryData.data.endDate)}
                                                inputProps={
                                                    {
                                                        id: 'end_date',
                                                        name: 'end_date',
                                                        className: css(appStyles.input, styles.inputItem),
                                                        disabled: disabledUpdate
                                                    }
                                                }
                                                closeOnSelect={true}
                                                timeFormat={false}
                                            />
                                        </div>
                                    </div>

                                    {
                                        permissions.hasAnyFormList(['semester_update', 'semester_delete']) ?
                                            <div className={styles.actionItems}>
                                                {
                                                    permissions.has('semester_update') ?
                                                        <button name='save'
                                                            className={
                                                                css(
                                                                    appStyles.actionItem,
                                                                    isPending ? appStyles.buttonSubmitting : ''
                                                                )
                                                            }
                                                        >{language?.save}</button> : null
                                                }
                                                {
                                                    permissions.has('semester_delete') ?
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                setShowDeletePopUp(true);
                                                            }}
                                                            className={appStyles.actionItemWhiteBorderRed}>
                                                            <MdDeleteOutline />
                                                            {language?.delete}
                                                        </button> : null
                                                }
                                            </div>
                                            : null
                                    }
                                </form>
                            </section>
                            {
                                permissions.has('course_view') ?
                                    <Link
                                        to='courses'
                                        state={queryData.data}
                                        className={styles.header}>
                                        <h2 className={styles.title}>
                                            {language?.courses}
                                        </h2>
                                    </Link>
                                    : null
                            }
                        </> : null
                }
            </main >
        </>
    );
}

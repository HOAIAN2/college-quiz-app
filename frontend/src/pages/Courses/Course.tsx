import appStyles from '~styles/App.module.css';
import styles from './styles/Course.module.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FiEdit, FiSave } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { apiDeleteCourse, apiGetCourseById, apiUpdateCourse } from '~api/course';
import { apiAutoCompleteUser } from '~api/user';
import CustomDataList from '~components/CustomDataList';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import { AUTO_COMPLETE_DEBOUNCE } from '~config/env';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import createFormUtils from '~utils/createFormUtils';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';
import CreateExam from './components/CreateExam';
import UpdateCourseStudents from './components/UpdateCourseStudents';
import ViewExam from './components/ViewExam';

export default function Course() {
    const { courseId } = useParams();
    const { permissions, appLanguage, appTitle } = useAppContext();
    const [examId, setExamId] = useState<number>(0);
    const [showViewExamPopUp, setShowViewExamPopUp] = useState(false);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [showUpdateStudentsPopUp, setShowUpdateStudentsPopUp] = useState(false);
    const [showCreateExamPopUp, setShowCreateExamPopUp] = useState(false);
    const language = useLanguage('page.course');
    const [queryUser, setQueryUser] = useState('');
    const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const formUtils = createFormUtils(styles);
    const disabledUpdate = !permissions.has('course_update');
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.PAGE_COURSE, { id: courseId }],
        queryFn: () => apiGetCourseById(String(courseId)),
        enabled: permissions.has('course_view')
    });
    const userQueryData = useQuery({
        queryKey: [QUERY_KEYS.AUTO_COMPLETE_SUBJECT, { search: debounceQueryUser }],
        queryFn: () => apiAutoCompleteUser('teacher', debounceQueryUser),
        enabled: debounceQueryUser ? true : false
    });
    const handleUpdateCourse = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        document.querySelector(`.${styles.formData}`)?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement;
            element.classList.remove('error');
            formUtils.getParentElement(element)?.removeAttribute('data-error');
        });
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        if (queryData.data) await apiUpdateCourse(formData, queryData.data.id);
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateCourse,
        onError: (error) => { formUtils.showFormError(error); },
        onSuccess: () => { queryData.refetch(); }
    });
    const handleDeleteCourse = async () => {
        await apiDeleteCourse(String(courseId));
    };
    const onDeleteCourseSuccess = () => {
        [QUERY_KEYS.PAGE_COURSES, QUERY_KEYS.PAGE_DASHBOARD].forEach(key => {
            queryClient.refetchQueries({ queryKey: [key] });
        });
        navigate('/semesters');
    };
    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: [QUERY_KEYS.PAGE_COURSE, { id: courseId }] });
        };
    }, [courseId, queryClient]);
    useEffect(() => {
        if (queryData.data) appTitle.setAppTitle(queryData.data.name);
    }, [appTitle, queryData.data]);
    if (!permissions.has('course_view')) return <Navigate to='/' />;
    return (
        <>
            {showViewExamPopUp ?
                <ViewExam
                    id={examId}
                    setShowPopUp={setShowViewExamPopUp}
                    onMutateSuccess={() => { queryData.refetch(); }}
                /> : null
            }
            {showUpdateStudentsPopUp && queryData.data ?
                <UpdateCourseStudents
                    courseDetail={queryData.data}
                    setShowPopUp={setShowUpdateStudentsPopUp}
                    onMutateSuccess={() => { queryData.refetch(); }}
                /> : null
            }
            {showCreateExamPopUp && queryData.data ?
                <CreateExam
                    courseDetail={queryData.data}
                    setShowPopUp={setShowCreateExamPopUp}
                    onMutateSuccess={() => { queryData.refetch(); }}
                /> : null
            }
            {showDeletePopUp === true ?
                <YesNoPopUp
                    message={language?.deleteMessage || ''}
                    mutateFunction={handleDeleteCourse}
                    setShowPopUp={setShowDeletePopUp}
                    onMutateSuccess={onDeleteCourseSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            <main className={css(appStyles.dashboard, styles.pageContent)}>
                {
                    queryData.isLoading ? <Loading /> : null
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
                                            <label className={appStyles.required} htmlFor='shortcode'>{language?.shortcode}</label>
                                            <input
                                                id='shortcode'
                                                disabled={disabledUpdate}
                                                defaultValue={queryData.data.shortcode}
                                                name='shortcode'
                                                className={css(appStyles.input, styles.inputItem)}
                                                type='text' />
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label className={appStyles.required} htmlFor='name'>{language?.name}</label>
                                            <input
                                                id='name'
                                                disabled={disabledUpdate}
                                                defaultValue={queryData.data.name}
                                                name='name'
                                                className={css(appStyles.input, styles.inputItem)}
                                                type='text' />
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label className={appStyles.required} htmlFor='teacher_id'>{language?.teacher}</label>
                                            <CustomDataList
                                                name='teacher_id'
                                                onInput={e => { setQueryUser(e.currentTarget.value); }}
                                                disabled={disabledUpdate}
                                                defaultOption={
                                                    {
                                                        label: languageUtils.getFullName(queryData.data.teacher.firstName, queryData.data.teacher.lastName),
                                                        value: queryData.data ? String(queryData.data.teacherId) : ''
                                                    }
                                                }
                                                options={userQueryData.data ? userQueryData.data.map(item => {
                                                    return {
                                                        label: languageUtils.getFullName(item.firstName, item.lastName),
                                                        value: String(item.id)
                                                    };
                                                }) : []}
                                                className={styles.customSelect}
                                            />
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label className={appStyles.required}>{language?.subject}</label>
                                            <input
                                                disabled
                                                defaultValue={queryData.data.subject.name}
                                                className={css(appStyles.input, styles.inputItem)}
                                                type='text' />
                                        </div>
                                    </div>
                                    {
                                        permissions.hasAnyFormList(['course_update', 'course_delete']) ?
                                            <div className={styles.actionItems}>
                                                {
                                                    permissions.has('course_update') ?
                                                        <button
                                                            name='save'
                                                            className={
                                                                css(
                                                                    appStyles.actionItem,
                                                                    isPending ? appStyles.buttonSubmitting : ''
                                                                )
                                                            }
                                                        ><FiSave />{language?.save}</button> : null
                                                }
                                                {
                                                    permissions.has('course_delete') ?
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                setShowDeletePopUp(true);
                                                            }}
                                                            className={appStyles.actionItemWhiteBorderRed}>
                                                            <MdDeleteOutline /> {language?.delete}
                                                        </button> : null
                                                }
                                            </div>
                                            : null
                                    }
                                </form>
                            </section>
                            <section>
                                <div className={styles.header}>
                                    <h2 className={styles.title}>{language?.studentList}</h2>
                                </div>
                                {
                                    permissions.has('course_update') ?
                                        <div
                                            className={appStyles.actionBar}
                                            style={{ paddingLeft: '20px' }}
                                        >
                                            <button
                                                className={css(appStyles.actionItem, styles.editStudentsButton)}
                                                onClick={() => {
                                                    setShowUpdateStudentsPopUp(true);
                                                }}
                                            >
                                                <FiEdit />
                                                <span>
                                                    {language?.edit}
                                                </span>
                                            </button>
                                        </div>
                                        : null
                                }
                                <div className={styles.enrollmentsContainer}>
                                    {
                                        queryData.data.enrollments
                                            .map(enrollment => {
                                                const fullName = languageUtils.getFullName(enrollment.user.firstName, enrollment.user.lastName);
                                                const schoolClass = enrollment.user.schoolClass?.shortcode;
                                                return (
                                                    <div
                                                        title={[fullName, schoolClass].join(' ')}
                                                        key={`enrollment-${enrollment.id}`}
                                                        className={css(appStyles.dashboardCard, styles.card)}
                                                    >
                                                        <div className={styles.cardContent}>
                                                            {[fullName, `(${schoolClass})`].join(' ')}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    }
                                </div>
                            </section>
                            <div className={styles.header}>
                                <h2 className={styles.title}>{language?.examtList}</h2>
                            </div>
                            {
                                permissions.has('exam_create') ?
                                    <div className='action-bar-d'
                                        style={{ paddingLeft: '20px' }}
                                    >
                                        <button
                                            className={appStyles.actionItem}
                                            onClick={() => {
                                                setShowCreateExamPopUp(true);
                                            }}
                                        >
                                            <RiAddFill /> {language?.add}
                                        </button>
                                    </div>
                                    : null
                            }
                            <div className={styles.examsContainer}>
                                {
                                    queryData.data.exams
                                        .map(exam => {
                                            return (
                                                <div
                                                    title={exam.name}
                                                    key={`exam-${exam.id}`}
                                                    onClick={() => {
                                                        setExamId(exam.id);
                                                        setShowViewExamPopUp(true);
                                                    }}
                                                    className={css(appStyles.dashboardCard, styles.examCard)}
                                                >
                                                    <div className={styles.cardSection}>
                                                        <p>
                                                            {exam.name}
                                                        </p>
                                                    </div>
                                                    <div className={styles.cardSection}>
                                                        {new Date(exam.examDate).toLocaleString(appLanguage.language)}
                                                    </div>
                                                    <div className={styles.cardSection}>
                                                        {
                                                            [
                                                                language?.minutes.replace('@number', String(exam.examTime)),
                                                                language?.numberOfQuesions.replace('@number', String(exam.questionsCount))
                                                            ].join(' ')
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })
                                }
                            </div>
                        </>
                        : null
                }
            </main>
        </>
    );
}

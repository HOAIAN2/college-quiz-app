import appStyles from '~styles/App.module.css';
import styles from './styles/Subject.module.css';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SyntheticEvent, useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { apiDeleteSubject, apiGetSubjectById, apiUpdateSubject } from '~api/subject';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import { Chapter } from '~models/chapter';
import NotFound from '~pages/Errors/NotFound';
import createFormUtils from '~utils/createFormUtils';
import css from '~utils/css';
import CreateChapter from './components/CreateChapter';
import ViewChapter from './components/ViewChapter';

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
        queryFn: () => apiGetSubjectById(String(id)),
        enabled: permissions.has('subject_view'),
        retry: false,
        refetchOnWindowFocus: false,
    });
    const handleUpdateSubject = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault();
        if (!permissions.has('subject_update')) return;
        document.querySelector(`.${styles.formData}`)?.querySelectorAll('input[name]').forEach(node => {
            const element = node as HTMLInputElement;
            element.classList.remove('error');
            formUtils.getParentElement(element)?.removeAttribute('data-error');
        });
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        if (queryData.data) await apiUpdateSubject(formData, queryData.data.id);
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateSubject,
        onError: (error) => { formUtils.showFormError(error); },
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
    if (!permissions.has('subject_view')) return <Navigate to='/' />;
    if (queryData.error) return (
        <main className={css(appStyles.dashboard, styles.pageContent)}>
            <NotFound />
        </main>
    );
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
                                            <label className={appStyles.required} htmlFor='shortcode'>{language?.shortcode}</label>
                                            <input
                                                id='shortcode'
                                                disabled={!permissions.has('subject_update')}
                                                defaultValue={queryData.data.shortcode}
                                                name='shortcode'
                                                className={css(appStyles.input, styles.inputItem)}
                                                type='text' />
                                        </div>
                                        <div className={styles.wrapItem}>
                                            <label className={appStyles.required} htmlFor='name'>{language?.name}</label>
                                            <input
                                                id='name'
                                                disabled={!permissions.has('subject_update')}
                                                defaultValue={queryData.data.name}
                                                name='name'
                                                className={css(appStyles.input, styles.inputItem)}
                                                type='text' />
                                        </div>
                                    </div>
                                    {
                                        permissions.hasAnyFormList(['subject_update', 'subject_delete']) ?
                                            <div className={styles.actionItems}>
                                                {
                                                    permissions.has('subject_update') ?
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
                                                    permissions.has('subject_delete') ?
                                                        <button
                                                            type='button'
                                                            onClick={() => {
                                                                setShowDeletePopUp(true);
                                                            }}
                                                            className={appStyles.actionItemWhiteBorderRed}>
                                                            <MdDeleteOutline /> {language?.delete}
                                                        </button>
                                                        : null
                                                }
                                            </div>
                                            : null
                                    }
                                </form>
                            </section>
                            <div className={styles.header}>
                                <h2 className={styles.title}>{language?.chapters}</h2>
                            </div>
                            {
                                permissions.has('subject_update') ?
                                    <div className={appStyles.actionBar}
                                        style={{ marginBottom: '20px' }}
                                    >
                                        <div className={appStyles.actionItem}
                                            onClick={() => {
                                                setShowCreateChapterPopUp(true);
                                            }}
                                        >
                                            <RiAddFill /> {language?.add}
                                        </div>
                                    </div>
                                    : null
                            }
                            <div className={styles.chaptersContainer}>
                                {
                                    queryData.data.chapters.sort((a, b) =>
                                        a.chapterNumber - b.chapterNumber
                                    )
                                        .map(chapter => {
                                            return (
                                                <div
                                                    key={`chapter-${chapter.id}`}
                                                    className={css(appStyles.dashboardCard, styles.card)}
                                                    onClick={() => {
                                                        setCurrentChapter(chapter);
                                                        setShowViewChapterPopUp(true);
                                                    }}
                                                >
                                                    <div className={styles.cardTop}>
                                                        {`${chapter.chapterNumber}. ${chapter.name}`}
                                                    </div>
                                                    <div className={styles.cardBottom}>
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
                                        className={styles.header}>
                                        <h2 className={styles.title}>
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

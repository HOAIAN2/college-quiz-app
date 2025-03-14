import appStyles from '~styles/App.module.css';
import styles from '~styles/CardPage.module.css';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiImport } from 'react-icons/bi';
import { RiAddFill } from 'react-icons/ri';
import { Navigate, useLocation, useParams, useSearchParams } from 'react-router';
import { apiGetQuestions } from '~api/question';
import { apiGetSubjectById } from '~api/subject';
import CustomSelect from '~components/CustomSelect';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import { SubjectDetail } from '~models/subject';
import css from '~utils/css';
import CreateQuestion from './components/CreateQuestion';
import ImportQuestions from './components/ImportQuestions';
import ViewQuestion from './components/ViewQuestion';

export default function Questions() {
    const { state } = useLocation() as { state: SubjectDetail | null; };
    const [subjectDetail, setSubjectDetail] = useState(state);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showCreatePopUp, setShowCreatePopUp] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [questionId, setQuestionId] = useState<number>(0);
    const [showViewPopUp, setShowViewPopUp] = useState(false);
    const [showImportPopUp, setShowImportPopUp] = useState(false);
    const queryDebounce = useDebounce(searchQuery);
    const { permissions, appTitle } = useAppContext();
    const { id } = useParams();
    const language = useLanguage('page.questions');
    const queryData = useQuery({
        queryKey: [
            QUERY_KEYS.PAGE_QUESTIONS,
            {
                chapter: searchParams.get('chapter'),
                search: queryDebounce
            },
        ],
        queryFn: () => apiGetQuestions({
            subjectId: String(id),
            chapterId: searchParams.get('chapter'),
            search: queryDebounce
        }),
        enabled: permissions.has('question_view') && permissions.has('subject_view')
    });
    const chapterOptions = subjectDetail?.chapters.map(chapter => ({
        value: String(chapter.id),
        label: `${chapter.chapterNumber}. ${chapter.name}`
    }));
    useEffect(() => {
        if (!permissions.has('subject_view')) return;
        apiGetSubjectById(String(id)).then(res => {
            setSubjectDetail(res);
        });
    }, [id, permissions]);
    useEffect(() => {
        if (!searchParams.get('search') && !queryDebounce) return;
        if (queryDebounce === '') searchParams.delete('search');
        else searchParams.set('search', queryDebounce);
        setSearchParams(searchParams);
    }, [queryDebounce, searchParams, setSearchParams]);
    useEffect(() => {
        if (language && subjectDetail) {
            appTitle.setAppTitle(language.title.replace('@subject', subjectDetail.name));
        }
    }, [appTitle, language, subjectDetail]);
    if (!permissions.has('question_view') || !permissions.has('subject_view')) return <Navigate to='/' />;
    if (!subjectDetail) return null;
    return (
        <>
            {showViewPopUp === true ?
                <ViewQuestion
                    id={questionId}
                    subjectDetail={subjectDetail}
                    setShowPopUp={setShowViewPopUp}
                    onMutateSuccess={() => { queryData.refetch(); }}
                />
                : null
            }
            {showCreatePopUp === true ?
                <CreateQuestion
                    onMutateSuccess={() => { queryData.refetch(); }}
                    setShowPopUp={setShowCreatePopUp}
                    subjectDetail={subjectDetail}
                /> : null}
            {showImportPopUp === true ?
                <ImportQuestions
                    onMutateSuccess={() => { queryData.refetch(); }}
                    setShowPopUp={setShowImportPopUp}
                    subjectId={String(id)}
                    chapterOptions={chapterOptions || []}
                />
                : null}
            <main className={appStyles.dashboard}>
                {
                    permissions.hasAnyFormList(['question_create'])
                        ?
                        <section className={appStyles.actionBar}>
                            {
                                permissions.has('question_create') ?
                                    <>
                                        <div
                                            className={appStyles.actionItem}
                                            onClick={() => {
                                                setShowCreatePopUp(true);
                                            }}
                                        >
                                            <RiAddFill /> {language?.add}
                                        </div>

                                        <div
                                            className={appStyles.actionItemWhite}
                                            onClick={() => {
                                                setShowImportPopUp(true);
                                            }}
                                        >
                                            <BiImport /> {language?.import}
                                        </div>
                                    </>
                                    : null
                            }
                        </section>
                        : null
                }
                <section className={styles.pageContent}>
                    {
                        queryData.isLoading ? <Loading /> : null
                    }
                    <div className={styles.filterForm}>
                        <div className={styles.wrapInputItem}>
                            <label>{language?.filter.chapter}</label>
                            <CustomSelect
                                defaultOption={
                                    {
                                        label: language?.unselect,
                                        value: ''
                                    }
                                }
                                options={
                                    [
                                        {
                                            label: language?.unselect,
                                            value: ''
                                        },
                                        ...chapterOptions ?? []
                                    ]
                                }
                                onChange={(option) => {
                                    if (option.value != '') searchParams.set('chapter', option.value);
                                    else searchParams.delete('chapter');
                                    setSearchParams(searchParams);
                                }}
                                className={styles.customSelect}
                            />
                        </div>
                        <div className={styles.wrapInputItem}>
                            <label htmlFor="">{language?.filter.search}</label>
                            <input
                                onInput={(e) => {
                                    setSearchQuery(e.currentTarget.value);
                                }}
                                name='search'
                                defaultValue={queryDebounce}
                                className={css(appStyles.input, styles.inputItem)}
                            />
                        </div>
                    </div>
                    <div className={styles.wrapCardContainer}>
                        <div className={styles.cardContainer}>
                            {queryData.data ?
                                queryData.data.map(item => {
                                    return (
                                        <div
                                            onClick={() => {
                                                setQuestionId(item.id);
                                                setShowViewPopUp(true);
                                            }}
                                            key={`question-${item.id}`}
                                            className={css(appStyles.dashboardCard, styles.card)}>
                                            <div className={styles.cardTop}>
                                                <p className={styles.content} dangerouslySetInnerHTML={{ __html: item.content }} >
                                                    {/* {item.content} */}
                                                </p>
                                            </div>
                                            <div className={styles.cardBottom}>
                                                <AiOutlineQuestionCircle />
                                                {language?.questionLevel[item.level]}
                                            </div>
                                        </div>
                                    );
                                }) : null}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

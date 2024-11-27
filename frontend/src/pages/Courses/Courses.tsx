import appStyles from '~styles/App.module.css';
import styles from '~styles/CardPage.module.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LuBookOpenCheck } from 'react-icons/lu';
import { RiAddFill } from 'react-icons/ri';
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router';
import { apiGetCourses } from '~api/course';
import { apiGetSemesterById } from '~api/semester';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import { Semester } from '~models/semester';
import css from '~utils/css';
import CreateCourse from './components/CreateCourse';

export default function Courses() {
    const { state } = useLocation() as { state: Semester | null; };
    const [semesterDetail, setSemesterDetail] = useState(state);
    const [showCreatePopUp, setShowCreatePopUp] = useState(false);
    const { permissions, appTitle } = useAppContext();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const queryDebounce = useDebounce(searchQuery);
    const language = useLanguage('page.courses');
    const queryClient = useQueryClient();
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.PAGE_COURSES, {
            search: queryDebounce,
            semesterId: Number(id)
        }],
        queryFn: () => apiGetCourses({
            search: queryDebounce,
            semesterId: Number(id) || undefined
        }),
        enabled: permissions.has('course_view')
    });
    useEffect(() => {
        apiGetSemesterById(String(id))
            .then(res => {
                setSemesterDetail(res);
            });
    }, [id]);
    const onMutateSuccess = () => {
        [QUERY_KEYS.PAGE_COURSES, QUERY_KEYS.PAGE_DASHBOARD].forEach(key => {
            queryClient.refetchQueries({ queryKey: [key] });
        });
    };
    useEffect(() => {
        if (!searchParams.get('search') && !queryDebounce) return;
        if (queryDebounce === '') searchParams.delete('search');
        else searchParams.set('search', queryDebounce);
        setSearchParams(searchParams);
    }, [queryDebounce, searchParams, setSearchParams]);
    useEffect(() => {
        if (language && semesterDetail) {
            appTitle.setAppTitle(language.title.replace('@semester', semesterDetail.name));
        }
    }, [appTitle, language, semesterDetail]);
    if (!semesterDetail) return null;
    if (!permissions.has('course_view')) return <Navigate to='/' />;
    return (
        <>
            {showCreatePopUp && queryData.data ?
                <CreateCourse
                    semester={semesterDetail}
                    numberOfCourses={queryData.data.length}
                    onMutateSuccess={onMutateSuccess}
                    setShowPopUp={setShowCreatePopUp}
                /> : null}
            <main className={appStyles.dashboard}>
                {
                    permissions.hasAnyFormList(['course_create',])
                        ?
                        <section className={appStyles.actionBar}>
                            {
                                permissions.has('course_create') ?
                                    <div
                                        className={appStyles.actionItem}
                                        onClick={() => {
                                            setShowCreatePopUp(true);
                                        }}
                                    >
                                        <RiAddFill /> {language?.add}
                                    </div>
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
                            <label>{language?.filter.search}</label>
                            <input
                                onInput={(e) => {
                                    setSearchQuery(e.currentTarget.value);
                                }}
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
                                        <Link
                                            key={`course-${item.id}`}
                                            to={`${item.id}`}
                                            className={css(appStyles.dashboardCard, styles.card)
                                            }>
                                            <div className={styles.cardTop}>
                                                {item.name}
                                            </div>
                                            <div className={styles.cardBottom}>
                                                <LuBookOpenCheck />
                                                {item.shortcode}
                                            </div>
                                        </Link>
                                    );
                                }) : null}
                        </div>
                    </div>
                </section>
            </main >
        </>
    );
}

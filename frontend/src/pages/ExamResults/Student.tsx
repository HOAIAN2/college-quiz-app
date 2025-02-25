import appStyles from '~styles/App.module.css';
import styles from './styles/Student.module.css';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { BiExport } from 'react-icons/bi';
import { Link, useParams, useSearchParams } from 'react-router';
import { apiGetExamResultsByUser } from '~api/exam-result';
import { apiAutoCompleteSubject, apiGetSubjectById } from '~api/subject';
import { apiGetUserById } from '~api/user';
import CustomDataList from '~components/CustomDataList';
import Loading from '~components/Loading';
import { AUTO_COMPLETE_DEBOUNCE } from '~config/env';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import caculateScore from '~utils/caculateScore';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';

export default function Student() {
    const { permissions, appLanguage, appTitle } = useAppContext();
    const { id } = useParams();
    const language = useLanguage('page_exam_results_user');
    const [querySubject, setQuerySubject] = useState('');
    const debounceQuerySubject = useDebounce(querySubject, AUTO_COMPLETE_DEBOUNCE);
    const [searchParams, setSearchParams] = useSearchParams();
    const initQuerySubject = useRef(searchParams.get('subject_id') || '');
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM_RESULTS_BY_USER, {
            id: id,
            subjectId: searchParams.get('subject_id')
        }],
        queryFn: () => apiGetExamResultsByUser(String(id), {
            subjectId: searchParams.get('subject_id') || '',
        })
    });
    const userQueryData = useQuery({
        queryKey: [QUERY_KEYS.USER_DETAIL, { id: id }],
        queryFn: () => apiGetUserById(String(id)),
        refetchOnWindowFocus: false,
    });
    const initQuerySubjectData = useQuery({
        queryKey: [QUERY_KEYS.PAGE_SUBJECT, { id: searchParams.get('subject_id') }],
        queryFn: () => apiGetSubjectById(searchParams.get('subject_id') || ''),
        enabled: initQuerySubject.current && searchParams.get('subject_id') ? true : false,
        refetchOnWindowFocus: false,
    });
    const subjectQueryData = useQuery({
        queryKey: [QUERY_KEYS.AUTO_COMPLETE_SUBJECT, { search: debounceQuerySubject }],
        queryFn: () => apiAutoCompleteSubject(debounceQuerySubject),
        enabled: debounceQuerySubject ? true : false
    });
    useEffect(() => {
        if (!language) return;
        if (!userQueryData.data) return;
        const fullname = languageUtils.getFullName(userQueryData.data.firstName, userQueryData.data.lastName);
        appTitle.setAppTitle(language.title.replace('@name', fullname));
    }, [appTitle, language, userQueryData.data]);
    if (initQuerySubject.current && !initQuerySubjectData.data) return null;
    return (
        <>
            <main className={css(appStyles.dashboard)}>
                {
                    queryData.isLoading ? <Loading /> : null
                }
                <div className={appStyles.actionBar}>
                    <button
                        className={
                            css(
                                appStyles.actionItemWhite
                            )
                        }
                        onClick={() => { }}
                    >
                        <BiExport />
                        {language?.export}
                    </button>
                </div>
                <section className={styles.filterForm}>
                    <div className={styles.wrapInputItem}>
                        <label htmlFor='subject_id'>{language?.subject}</label>
                        <CustomDataList
                            name='subject_id'
                            defaultOption={
                                {
                                    label: initQuerySubject.current ? initQuerySubjectData.data!.name : '',
                                    value: initQuerySubject.current ? String(initQuerySubjectData.data!.id) : ''
                                }
                            }
                            onInput={e => {
                                setQuerySubject(e.currentTarget.value);
                                if (!e.currentTarget.value.trim()) {
                                    searchParams.delete('subject_id');
                                    setSearchParams(searchParams);
                                }
                            }}
                            options={subjectQueryData.data ? subjectQueryData.data.map(item => {
                                return {
                                    label: item.name,
                                    value: String(item.id)
                                };
                            }) : []}
                            onChange={(e) => {
                                searchParams.set('subject_id', e.value);
                                setSearchParams(searchParams);
                            }}
                            className={styles.customSelect}
                        />
                    </div>
                </section>
                <section className={styles.resultContainer}>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={css(styles.column, styles.superLarge)}>
                                        {language?.examName}
                                    </th>
                                    <th className={css(styles.column, styles.medium)}>
                                        {language?.score}
                                    </th>
                                    <th className={css(styles.column, styles.medium)}>
                                        {language?.submittedAt}
                                    </th>
                                    <th className={css(styles.column, styles.medium)}>
                                        {language?.remarked}
                                    </th>
                                    <th className={css(styles.column, styles.medium)}>
                                        {language?.cancelled}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    queryData.data?.map(item => {
                                        return (
                                            <tr key={`exam-result-${item.id}`}>
                                                <td className={css(styles.column, styles.superLarge)}>
                                                    {item.exam.name}
                                                </td>
                                                <td className={css(styles.column, styles.medium)}>
                                                    {
                                                        caculateScore(item.correctCount, item.questionCount)
                                                    }
                                                </td>
                                                <td className={css(styles.column, styles.medium)}>
                                                    {new Date(item.createdAt).toLocaleString(appLanguage.language)}
                                                </td>
                                                <td className={css(styles.column, styles.medium)}>
                                                    {
                                                        item.remarkByUserId ? language?.yes : language?.no
                                                    }
                                                </td>
                                                <td className={css(styles.column, styles.medium)}>
                                                    {
                                                        item.cancelledByUserId ? language?.yes : language?.no
                                                    }
                                                </td>
                                                <td className={css(styles.column, styles.medium)}>
                                                    {
                                                        permissions.has('exam_result_view') ? <Link to={`/exams/${item.examId}/results/${item.id}`}>{language?.detail}</Link> : null
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

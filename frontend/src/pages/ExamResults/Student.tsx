import appStyles from '~styles/App.module.css';
import styles from '~styles/CardPage.module.css';

import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { apiGetExamResultsByUser } from '~api/exam-result';
import { apiAutoCompleteSubject, apiGetSubjectById } from '~api/subject';
import CustomDataList from '~components/CustomDataList';
import Loading from '~components/Loading';
import { AUTO_COMPLETE_DEBOUNCE } from '~config/env';
import QUERY_KEYS from '~constants/query-keys';
import useDebounce from '~hooks/useDebounce';
import css from '~utils/css';

export default function Student() {
    const { id } = useParams();
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
    const initQuerySubjectData = useQuery({
        queryKey: [QUERY_KEYS.PAGE_SUBJECT, { id: searchParams.get('subject_id') }],
        queryFn: () => apiGetSubjectById(searchParams.get('subject_id') || ''),
        enabled: initQuerySubject.current ? true : false,
        // enabled: permissions.has('subject_view'),
        // retry: false,
        // refetchOnWindowFocus: false,
    });
    const subjectQueryData = useQuery({
        queryKey: [QUERY_KEYS.AUTO_COMPLETE_SUBJECT, { search: debounceQuerySubject }],
        queryFn: () => apiAutoCompleteSubject(debounceQuerySubject),
        enabled: debounceQuerySubject ? true : false
    });
    if (initQuerySubject.current && !initQuerySubjectData.data) return null;
    return (
        <>
            <main className={css(appStyles.dashboard)}>
                {
                    queryData.isLoading ? <Loading /> : null
                }
                <section className={styles.filterForm}>
                    <div className={styles.wrapInputItem}>
                        <label htmlFor='subject_id'>Môn học</label>
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
            </main>
        </>
    );
}

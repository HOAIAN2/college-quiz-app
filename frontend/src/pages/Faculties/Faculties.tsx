import appStyles from '~styles/App.module.css';
import styles from '~styles/TablePage.module.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { Navigate, useSearchParams } from 'react-router';
import { apiDeleteFacultiesByIds, apiGetFaculties } from '~api/faculty';
import CustomSelect from '~components/CustomSelect';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import CreateFaculty from './components/CreateFaculty';
import FacultiesTable from './components/FacultiesTable';

export default function Faculties() {
    const { permissions, appTitle } = useAppContext();
    const language = useLanguage('page.faculties');
    const [showCreatePopUp, setShowCreatePopUp] = useState(false);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const queryDebounce = useDebounce(searchQuery);
    const [selectedFacultyIds, setSelectedFacultyIds] = useState<Set<string | number>>(new Set());
    const queryData = useQuery({
        queryKey: [
            QUERY_KEYS.PAGE_FACULTIES,
            {
                page: searchParams.get('page') || '1',
                perPage: searchParams.get('per_page') || '10',
                search: queryDebounce
            },
        ],
        queryFn: () => apiGetFaculties({
            page: Number(searchParams.get('page') || '1'),
            perPage: Number(searchParams.get('per_page') || '10'),
            search: queryDebounce
        }),
        enabled: permissions.has('faculty_view')
    });
    const handleDeleteFaculties = async () => {
        await apiDeleteFacultiesByIds(Array.from(selectedFacultyIds));
    };
    const onMutateSuccess = () => {
        [QUERY_KEYS.PAGE_FACULTIES].forEach(key => {
            queryClient.refetchQueries({ queryKey: [key] });
        });
    };
    useEffect(() => {
        setSelectedFacultyIds(new Set());
    }, [queryData.data]);
    useEffect(() => {
        if (!searchParams.get('search') && !queryDebounce) return;
        if (queryDebounce === '') searchParams.delete('search');
        else searchParams.set('search', queryDebounce);
        setSearchParams(searchParams);
    }, [queryDebounce, searchParams, setSearchParams]);
    useEffect(() => {
        if (language) appTitle.setAppTitle(language.faculties);
    }, [appTitle, language]);
    if (!permissions.has('faculty_view')) return <Navigate to='/' />;
    return (
        <>
            {showCreatePopUp === true ?
                <CreateFaculty
                    onMutateSuccess={onMutateSuccess}
                    setShowPopUp={setShowCreatePopUp}
                /> : null}
            {showDeletePopUp === true ?
                <YesNoPopUp
                    message={language?.deleteMessage.replace('@n', String(selectedFacultyIds.size)) || ''}
                    mutateFunction={handleDeleteFaculties}
                    setShowPopUp={setShowDeletePopUp}
                    onMutateSuccess={onMutateSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            <main className={appStyles.dashboard}>
                {
                    permissions.hasAnyFormList(['faculty_create', 'faculty_delete'])
                        ?
                        <section className={appStyles.actionBar}>
                            {
                                permissions.has('faculty_create') ?
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
                            {
                                selectedFacultyIds.size > 0 && permissions.has('faculty_delete') ?
                                    <div
                                        onClick={() => {
                                            setShowDeletePopUp(true);
                                        }}
                                        className={appStyles.actionItemWhiteBorderRed}>
                                        <MdDeleteOutline /> {language?.delete}
                                    </div>
                                    : null
                            }
                        </section>
                        : null
                }
                <section className={styles.tablePageContent}>
                    <div className={styles.filterForm}>
                        <div className={styles.wrapInputItem}>
                            <label>{language?.filter.perPage}</label>
                            <CustomSelect
                                defaultOption={
                                    {
                                        label: '10',
                                        value: '10'
                                    }
                                }
                                options={[
                                    {
                                        label: '10',
                                        value: '10'
                                    },
                                    {
                                        label: '20',
                                        value: '20'
                                    },
                                    {
                                        label: '30',
                                        value: '30'
                                    },
                                    {
                                        label: '40',
                                        value: '40'
                                    },
                                    {
                                        label: '50',
                                        value: '50'
                                    },
                                ]}
                                onChange={(option) => {
                                    searchParams.set('per_page', option.value);
                                    setSearchParams(searchParams);
                                }}
                                className={styles.customSelect}
                            />
                        </div>
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
                    <div className={styles.wrapTable}>
                        {
                            queryData.isLoading ? <Loading /> : null
                        }
                        {!queryData.isError ?
                            <FacultiesTable
                                data={queryData.data}
                                searchParams={searchParams}
                                onMutateSuccess={onMutateSuccess}
                                setSearchParams={setSearchParams}
                                setSelectedRows={setSelectedFacultyIds}
                            />
                            : null}
                    </div>
                </section>
            </main>
        </>
    );
}

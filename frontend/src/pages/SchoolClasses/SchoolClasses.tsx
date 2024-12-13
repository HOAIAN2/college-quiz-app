import appStyles from '~styles/App.module.css';
import styles from '~styles/TablePage.module.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { Navigate, useSearchParams } from 'react-router-dom';
import { apiDeleteSchoolClassIds, apiGetSchoolClasses } from '~api/school-class';
import CustomSelect from '~components/CustomSelect';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import CreateSchoolClass from './components/CreateSchoolClass';
import SchoolClassesTable from './components/SchoolClassesTable';

export default function SchoolClasses() {
    const { permissions, appTitle } = useAppContext();
    const language = useLanguage('page.school_classes');
    const [searchParams, setSearchParams] = useSearchParams();
    const [showCreatePopUp, setShowCreatePopUp] = useState(false);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [selectedSchoolClassIds, setSelectedSchoolClassIds] = useState<Set<string | number>>(new Set());
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const queryDebounce = useDebounce(searchQuery);
    const queryClient = useQueryClient();
    const queryData = useQuery({
        queryKey: [
            QUERY_KEYS.PAGE_SCHOOL_CLASSES,
            {
                page: searchParams.get('page') || '1',
                perPage: searchParams.get('per_page') || '10',
                search: queryDebounce
            },
        ],
        queryFn: () => apiGetSchoolClasses({
            page: Number(searchParams.get('page')),
            perPage: Number(searchParams.get('per_page')),
            search: queryDebounce
        }),
        enabled: permissions.has('school_class_view')
    });
    const handleDeleteSchoolClasses = async () => {
        await apiDeleteSchoolClassIds(Array.from(selectedSchoolClassIds));
    };
    const onMutateSuccess = () => {
        [QUERY_KEYS.PAGE_SCHOOL_CLASSES].forEach(key => {
            queryClient.refetchQueries({ queryKey: [key] });
        });
    };
    useEffect(() => {
        setSelectedSchoolClassIds(new Set());
    }, [queryData.data]);
    useEffect(() => {
        if (!searchParams.get('search') && !queryDebounce) return;
        if (queryDebounce === '') searchParams.delete('search');
        else searchParams.set('search', queryDebounce);
        setSearchParams(searchParams);
    }, [queryDebounce, searchParams, setSearchParams]);
    useEffect(() => {
        if (language) appTitle.setAppTitle(language.schoolClasses);
    }, [appTitle, language]);
    if (!permissions.has('school_class_view')) return <Navigate to='/' />;
    return (
        <>
            {showCreatePopUp === true ?
                <CreateSchoolClass
                    onMutateSuccess={onMutateSuccess}
                    setShowPopUp={setShowCreatePopUp}
                /> : null}
            {showDeletePopUp === true ?
                <YesNoPopUp
                    message={language?.deleteMessage.replace('@n', String(selectedSchoolClassIds.size)) || ''}
                    mutateFunction={handleDeleteSchoolClasses}
                    setShowPopUp={setShowDeletePopUp}
                    onMutateSuccess={onMutateSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            <main className={appStyles.dashboard}>
                {
                    permissions.hasAnyFormList(['school_class_create', 'school_class_delete'])
                        ?
                        <section className={appStyles.actionBar}>
                            {
                                permissions.has('school_class_create') ?
                                    <div className={appStyles.actionItem}
                                        onClick={() => {
                                            setShowCreatePopUp(true);
                                        }}
                                    >
                                        <RiAddFill /> {language?.add}
                                    </div>
                                    : null
                            }
                            {
                                selectedSchoolClassIds.size > 0 && permissions.has('school_class_delete') ?
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
                            <SchoolClassesTable
                                data={queryData.data}
                                searchParams={searchParams}
                                onMutateSuccess={onMutateSuccess}
                                setSearchParams={setSearchParams}
                                setSelectedRows={setSelectedSchoolClassIds}
                            />
                            : null}
                    </div>
                </section>
            </main>
        </>
    );
}

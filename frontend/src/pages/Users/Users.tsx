import appStyles from '~styles/App.module.css';
import styles from '~styles/TablePage.module.css';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
    BiExport,
    BiImport
} from 'react-icons/bi';
import { MdDeleteOutline } from 'react-icons/md';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import {
    RiAddFill
} from 'react-icons/ri';
import { Navigate, useSearchParams } from 'react-router-dom';
import { apiAutoCompleteFaculty, apiGetFacultyById } from '~api/faculty';
import { apiAutoCompleteSchoolClass, apiGetSchoolClassById } from '~api/school-class';
import { apiDeleteUserByIds, apiGetUsersByType, apiImportUsers } from '~api/user';
import CustomDataList from '~components/CustomDataList';
import CustomSelect from '~components/CustomSelect';
import ImportData from '~components/ImportData';
import Loading from '~components/Loading';
import YesNoPopUp from '~components/YesNoPopUp';
import { AUTO_COMPLETE_DEBOUNCE } from '~config/env';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import { RoleName } from '~models/role';
import css from '~utils/css';
import { importTemplateFileUrl } from '~utils/template';
import CreateUser from './components/CreateUser';
import ExportUsers from './components/ExportUsers';
import UsersTable from './components/UsersTable';

const schoolClassFilterKey = 'school_class_id';
const facultyFilterKey = 'faculty_id';

type UsersProps = {
    role: RoleName;
};
export default function Users({
    role
}: UsersProps) {
    const language = useLanguage('page.users');
    const { permissions, appTitle } = useAppContext();
    const [showCreatePopUp, setShowCreatePopUp] = useState(false);
    const [showExportPopUp, setShowExportPopUp] = useState(false);
    const [showImportPopUp, setShowImportPopUp] = useState(false);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string | number>>(new Set());
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const queryDebounce = useDebounce(searchQuery);
    const [queryClass, setQueryClass] = useState('');
    const [queryFaculty, setQueryFaculty] = useState('');
    const debounceQueryClass = useDebounce(queryClass, AUTO_COMPLETE_DEBOUNCE);
    const debounceQueryFaculty = useDebounce(queryFaculty, AUTO_COMPLETE_DEBOUNCE);
    const initClass = useRef(searchParams.get(schoolClassFilterKey) || '');
    const initFaculty = useRef(searchParams.get(facultyFilterKey) || '');
    const queryClient = useQueryClient();
    const queryData = useQuery({
        queryKey: [
            QUERY_KEYS.PAGE_USERS,
            {
                role: role,
                page: searchParams.get('page') || '1',
                perPage: searchParams.get('per_page') || '10',
                search: queryDebounce,
                facultyId: searchParams.get(facultyFilterKey) || undefined,
                schoolClassId: searchParams.get(schoolClassFilterKey) || undefined
            }
        ],
        queryFn: () => apiGetUsersByType({
            role: role,
            page: Number(searchParams.get('page')),
            perPage: Number(searchParams.get('per_page')),
            search: queryDebounce,
            facultyId: searchParams.get(facultyFilterKey) || undefined,
            schoolClassId: searchParams.get(schoolClassFilterKey) || undefined
        }),
        enabled: permissions.has('user_view')
    });
    const classQueryData = useQuery({
        queryKey: [QUERY_KEYS.AUTO_COMPLETE_SCHOOL_CLASS, { search: debounceQueryClass }],
        queryFn: () => apiAutoCompleteSchoolClass(debounceQueryClass),
        enabled: debounceQueryClass ? true : false
    });
    const initClassQueryData = useQuery({
        queryKey: [QUERY_KEYS.SCHOOL_CLASS_DETAIL, { id: initClass.current }],
        queryFn: () => apiGetSchoolClassById(initClass.current),
        enabled: initClass.current ? true : false,
    });
    const initFacultyQueryData = useQuery({
        queryKey: [QUERY_KEYS.FACULTY_DETAIL, { id: initFaculty.current }],
        queryFn: () => apiGetFacultyById(initFaculty.current),
        enabled: initFaculty.current ? true : false,
    });
    const facultyQueryData = useQuery({
        queryKey: [QUERY_KEYS.AUTO_COMPLETE_FACULTY, { search: debounceQueryFaculty }],
        queryFn: () => apiAutoCompleteFaculty(debounceQueryFaculty),
        enabled: debounceQueryFaculty ? true : false
    });
    const importFunction = async (file: File) => {
        return apiImportUsers(file, role);
    };
    const handleDeleteUsers = async () => {
        await apiDeleteUserByIds(Array.from(selectedUserIds));
    };
    const onMutateSuccess = () => {
        [QUERY_KEYS.PAGE_USERS, QUERY_KEYS.PAGE_DASHBOARD].forEach(key => {
            queryClient.refetchQueries({ queryKey: [key] });
        });
    };
    useEffect(() => {
        setSelectedUserIds(new Set());
    }, [queryData.data]);
    useEffect(() => {
        return () => {
            if (!window.location.pathname.includes(role)) setSearchParams(new URLSearchParams());
        };
    });
    useEffect(() => {
        if (!searchParams.get('search') && !queryDebounce) return;
        if (queryDebounce === '') searchParams.delete('search');
        else searchParams.set('search', queryDebounce);
        setSearchParams(searchParams);
    }, [queryDebounce, searchParams, setSearchParams]);
    useEffect(() => {
        if (language) {
            if (role === 'student') appTitle.setAppTitle(language.student);
            if (role === 'teacher') appTitle.setAppTitle(language.teacher);
        }
    }, [appTitle, language, role]);
    if (!permissions.has('user_view')) return <Navigate to='/' />;
    if (initClass.current && !initClassQueryData.data) return null;
    if (initFaculty.current && !initFacultyQueryData.data) return null;
    return (
        <>
            {showCreatePopUp === true ?
                <CreateUser
                    role={role}
                    onMutateSuccess={onMutateSuccess}
                    setShowPopUp={setShowCreatePopUp}
                /> : null}
            {showExportPopUp === true ?
                <ExportUsers
                    role={role}
                    setShowPopUp={setShowExportPopUp}
                /> : null}
            {showDeletePopUp === true ?
                <YesNoPopUp
                    message={language?.deleteMessage.replace('@n', String(selectedUserIds.size)) || ''}
                    mutateFunction={handleDeleteUsers}
                    setShowPopUp={setShowDeletePopUp}
                    onMutateSuccess={onMutateSuccess}
                    langYes={language?.langYes}
                    langNo={language?.langNo}
                /> : null}
            {showImportPopUp === true ?
                <ImportData
                    title={[
                        language?.import,
                        language ? language[role] : ''
                    ].join(' ')
                    }
                    icon={<PiMicrosoftExcelLogoFill />}
                    teamplateUrl={importTemplateFileUrl[role]}
                    importFunction={importFunction}
                    setShowPopUp={setShowImportPopUp}
                    onMutateSuccess={onMutateSuccess}
                /> : null}
            <main className={appStyles.dashboard}>
                {
                    permissions.hasAnyFormList(['user_view', 'user_create', 'user_update', 'user_delete'])
                        ?
                        <section className={appStyles.actionBar}>
                            {
                                permissions.has('user_create') ?
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
                                permissions.has('user_create') ?
                                    <div className={appStyles.actionItemWhite}
                                        onClick={() => {
                                            setShowImportPopUp(true);
                                        }}
                                    >
                                        <BiImport /> {language?.import}
                                    </div>
                                    : null
                            }
                            {
                                permissions.has('user_view') ?
                                    <div className={appStyles.actionItemWhite}
                                        onClick={() => {
                                            setShowExportPopUp(true);
                                        }}
                                    >
                                        <BiExport /> {language?.export}
                                    </div>
                                    : null
                            }
                            {
                                selectedUserIds.size > 0 && permissions.has('user_delete') ?
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
                        <div style={{ zIndex: 2 }} className={styles.wrapInputItem}>
                            <label>{language?.filter.perPage}</label>
                            <CustomSelect
                                defaultOption={
                                    {
                                        label: searchParams.get('per_page') || '10',
                                        value: searchParams.get('per_page') || '10'
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
                        {role === 'student' ?
                            <div style={{ zIndex: 1 }} className={styles.wrapInputItem}>
                                <label htmlFor={schoolClassFilterKey}>{language?.class}</label>
                                <CustomDataList
                                    key='school_class-custom-datalist'
                                    name={schoolClassFilterKey}
                                    defaultOption={
                                        {
                                            label: initClass.current ? initClassQueryData.data!.name : '',
                                            value: initClass.current ? String(initClassQueryData.data!.id) : ''
                                        }
                                    }
                                    onInput={e => {
                                        setQueryClass(e.currentTarget.value);
                                        if (!e.currentTarget.value.trim()) {
                                            searchParams.delete(schoolClassFilterKey);
                                            setSearchParams(searchParams);
                                        }
                                    }}
                                    options={classQueryData.data ? classQueryData.data.map(item => {
                                        return {
                                            label: item.name,
                                            value: String(item.id)
                                        };
                                    }) : []}
                                    onChange={(option) => {
                                        searchParams.set(schoolClassFilterKey, String(option.value));
                                        setSearchParams(searchParams);
                                    }}
                                />
                            </div>
                            : role === 'teacher' ?
                                <div style={{ zIndex: 1 }} className={styles.wrapInputItem}>
                                    <label htmlFor={facultyFilterKey}>{language?.faculty}</label>
                                    <CustomDataList
                                        key='fauculty-custom-datalist'
                                        name={facultyFilterKey}
                                        defaultOption={
                                            {
                                                label: initFaculty.current ? initFacultyQueryData.data!.name : '',
                                                value: initFaculty.current ? String(initFacultyQueryData.data!.id) : ''
                                            }
                                        }
                                        onInput={e => {
                                            setQueryFaculty(e.currentTarget.value);
                                            if (!e.currentTarget.value.trim()) {
                                                searchParams.delete(facultyFilterKey);
                                                setSearchParams(searchParams);
                                            }
                                        }}
                                        options={facultyQueryData.data ? facultyQueryData.data.map(item => {
                                            return {
                                                label: item.name,
                                                value: String(item.id)
                                            };
                                        }) : []}
                                        onChange={(option) => {
                                            searchParams.set(facultyFilterKey, String(option.value));
                                            setSearchParams(searchParams);
                                        }}
                                    />
                                </div>
                                : null
                        }
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
                            <UsersTable
                                role={role}
                                data={queryData.data}
                                searchParams={searchParams}
                                onMutateSuccess={onMutateSuccess}
                                setSearchParams={setSearchParams}
                                setSelectedRows={setSelectedUserIds}
                            />
                            : null}
                    </div>
                </section>
            </main>
        </>
    );
}

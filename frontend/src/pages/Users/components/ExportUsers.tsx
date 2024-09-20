import appStyles from '~styles/App.module.css';
import styles from '../styles/ExportUsers.module.css';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { apiExportUsers, apiGetUserExportableFields } from '~api/user';
import Loading from '~components/Loading';
import CSS_TIMING from '~constants/css-timing';
import QUERY_KEYS from '~constants/query-keys';
import useLanguage from '~hooks/useLanguage';
import { RoleName } from '~models/role';
import { ExportQueryUserType } from '~models/user';
import css from '~utils/css';
import { saveBlob } from '~utils/saveBlob';

const schoolClassFilterKey = 'school_class_id';
const facultyFilterKey = 'faculty_id';

type ExportUsersProps = {
    role: RoleName;
    setExportMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ExportUsers({
    role,
    setExportMode
}: ExportUsersProps) {
    const language = useLanguage('component.export_users');
    const [hide, setHide] = useState(true);
    const [isPending, setIsPending] = useState(false);
    const applyFilterRef = useRef<HTMLInputElement>(null);
    const handleClosePopUp = () => {
        setHide(true);
        setTimeout(() => {
            setExportMode(false);
        }, CSS_TIMING.TRANSITION_TIMING_FAST);
    };
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.USER_EXPORTABLE_FIELDS],
        queryFn: () => apiGetUserExportableFields(role),
        refetchOnWindowFocus: false
    });
    const handleExportUsers = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query: ExportQueryUserType = {
            role: role,
            fields: formData.getAll('fields[]') as string[]
        };
        const fields: string[] = [];
        formData.forEach((value) => {
            fields.push(value as string);
        });
        if (applyFilterRef.current?.checked) {
            const searchParams = new URLSearchParams(window.location.search);
            query.schoolClassId = searchParams.get(schoolClassFilterKey) || undefined;
            query.facultyId = searchParams.get(facultyFilterKey) || undefined;
            query.search = searchParams.get('search') || undefined;
        }
        setIsPending(true);
        const defaultFileName = `Export-${role}-${new Date().toISOString().split('T')[0]}.xlsx`;
        apiExportUsers(query, defaultFileName)
            .then(res => {
                saveBlob(res.data, res.fileName);
            })
            .finally(() => {
                setIsPending(false);
            });
    };
    const handleSelectAll = (type: 'all' | 'none') => {
        document.querySelector(`.${styles.formData}`)
            ?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
            .forEach(item => {
                if (type === 'all') item.checked = true;
                else item.checked = false;
            });
    };
    useEffect(() => {
        setHide(false);
    }, []);
    return (
        <div className={
            css(
                styles.exportUsersContainer,
                hide ? styles.hide : ''
            )
        }>
            <div
                className={
                    css(
                        styles.exportUsersForm,
                        hide ? styles.hide : ''
                    )
                }>
                <div className={styles.header}>
                    <h2 className={styles.title}>{role === 'student' ? language?.exportStudents : language?.exportTeachers}</h2>
                    <div className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                {
                    queryData.isLoading ? <Loading /> : null
                }
                {
                    queryData.data ?
                        <form onSubmit={handleExportUsers} className={styles.formData}>
                            <div className={styles.groupInputs}>
                                <h3>{language?.options}</h3>
                                <div className={styles.wrapItem}>
                                    <input ref={applyFilterRef} id={'export_users_apply_filter'} type='checkbox' />
                                    <label htmlFor={'export_users_apply_filter'} className={styles.label}>{language?.applyFilter}</label>
                                </div>
                                <h3>{language?.selectFields}</h3>
                                {
                                    queryData.data.map(item => {
                                        return (
                                            <div key={`exportable-${item.field}`} className={styles.wrapItem}>
                                                <input id={item.field} type='checkbox' name='fields[]' value={item.field} />
                                                <label htmlFor={item.field} className={styles.label}>{item.fieldName}</label>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className={styles.actionItems}>
                                <button
                                    name='save'
                                    className={
                                        css(
                                            appStyles.actionItem,
                                            isPending ? appStyles.buttonSubmitting : ''
                                        )
                                    }>
                                    {language?.save}
                                </button>
                                <button
                                    onClick={() => { handleSelectAll('none'); }}
                                    style={{ width: 'fit-content' }}
                                    type='button'
                                    className={appStyles.actionItemWhite}
                                >{language?.deselectAll}
                                </button>
                                <button
                                    onClick={() => { handleSelectAll('all'); }}
                                    type='button'
                                    className={appStyles.actionItemWhite}>
                                    {language?.selectAll}
                                </button>
                            </div>
                        </form>
                        : null
                }
            </div>
        </div>
    );
}

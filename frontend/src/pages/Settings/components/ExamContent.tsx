import appStyles from '~styles/App.module.css';
import styles from '../styles/SettingsContent.module.css';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGetSettings, apiUpdateSettings } from '~api/settings';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';

export default function ExamContent() {
    const language = useLanguage('component.settings_content');
    const queryData = useQuery({
        queryFn: apiGetSettings,
        queryKey: [QUERY_KEYS.ALL_SETTINGS],
        refetchOnWindowFocus: false,
        staleTime: 10 * 60 * 1000 // 10 minutes
    });
    const handleUpdateSettings = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        await apiUpdateSettings(formData);
    };
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateSettings,
        onSuccess: () => {
            queryData.refetch();
        }
    });
    return (
        <>
            {
                queryData.isLoading ? <Loading /> : null
            }
            {
                isPending ? <Loading /> : null
            }
            {
                queryData.data ?
                    <article className={styles.article}>
                        <h3>{language?.exam.title}</h3>
                        <form onSubmit={mutate}>
                            <ul className={styles.appSettingList}>
                                {
                                    queryData.data?.filter(setting => setting.group === 'exam').map((setting, index) => {
                                        return (
                                            <li key={setting.key}>
                                                <label htmlFor={`data[${index}][value]`}>
                                                    {language?.exam[setting.key as keyof typeof language.exam]}
                                                </label>
                                                <input
                                                    hidden
                                                    name={`data[${index}][key]`}
                                                    value={setting.key}
                                                    readOnly
                                                />
                                                <input
                                                    id={`data[${index}][value]`}
                                                    className={css(appStyles.input, styles.inputItem)}
                                                    name={`data[${index}][value]`}
                                                    defaultValue={setting.value}
                                                />
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                            <div className={styles.actionItems}>
                                <button
                                    className={css(appStyles.actionItem, styles.buttonItem)}
                                >{language?.save}</button>
                            </div>
                        </form>
                    </article>
                    : null
            }
        </>
    );
}
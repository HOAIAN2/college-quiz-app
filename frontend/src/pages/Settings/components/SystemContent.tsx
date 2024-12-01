import appStyles from '~styles/App.module.css';
import styles from '../styles/SettingsContent.module.css';

import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { apiDeleteLogFile, apiDownloadLogFile, apiGetCallableCommands, apiRunArtisan } from '~api/settings';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import { saveBlob } from '~utils/saveBlob';

export default function SystemContent() {
    const { user } = useAppContext();
    const language = useLanguage('component.settings_content');
    const artisanCommandInputRef = useRef<HTMLInputElement>(null);
    const handleRunArtisan = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const command = artisanCommandInputRef.current?.value.trim();
        if (!command) return;
        const button = e.currentTarget;
        button.classList.add(appStyles.buttonSubmitting);
        apiRunArtisan(command)
            .finally(() => {
                button.classList.remove(appStyles.buttonSubmitting);
            });
    };
    const handleDownloadLogFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const button = e.currentTarget;
        button.classList.add(appStyles.buttonSubmitting);
        apiDownloadLogFile('laravel.log')
            .then(res => {
                saveBlob(res.data, res.fileName);
            })
            .finally(() => {
                button.classList.remove(appStyles.buttonSubmitting);
            });
    };
    const handleDeleteLogFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const button = e.currentTarget;
        button.classList.add(appStyles.buttonSubmitting);
        apiDeleteLogFile()
            .finally(() => {
                button.classList.remove(appStyles.buttonSubmitting);
            });
    };
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.CALLABLE_COMMANDS],
        queryFn: apiGetCallableCommands,
        refetchOnWindowFocus: false
    });
    return (
        <>
            {
                user.user?.role.name === 'admin' ?
                    <>
                        <article className={styles.article}>
                            <h3>{language?.artisancommand}</h3>
                            <p>{language?.runArtisanCommand}</p>
                            <label>{language?.command}</label>
                            <input
                                ref={artisanCommandInputRef}
                                className={css(appStyles.input, styles.inputItem)}
                                placeholder='schedule:run'
                                list='commands'
                            />
                            <datalist id='commands'>
                                {queryData.data?.map(command => {
                                    return (
                                        <option key={command} value={command}></option>
                                    );
                                })}
                            </datalist>
                            <div className={styles.actionItems}>
                                <button
                                    onClick={handleRunArtisan}
                                    className={css(appStyles.actionItem, styles.buttonItem)}
                                >{language?.run}</button>
                            </div>
                        </article>
                        <article className={styles.article}>
                            <h3>{language?.logFile}</h3>
                            <p>{language?.logDescription}</p>
                            <div className={styles.actionItems}>
                                <button
                                    onClick={handleDownloadLogFile}
                                    className={css(appStyles.actionItem, styles.buttonItem)}
                                >{language?.download}</button>
                                <button
                                    onClick={handleDeleteLogFile}
                                    className={css(appStyles.actionItemWhiteBorderRed, styles.buttonItem)}
                                >{language?.delete}</button>
                            </div>
                        </article>
                    </> : null
            }
        </>
    );
}

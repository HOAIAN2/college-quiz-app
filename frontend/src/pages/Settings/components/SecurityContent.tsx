import appStyles from '~styles/App.module.css';
import styles from '../styles/SettingsContent.module.css';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGetLoginSessions, apiRevokeLoginSession } from '~api/auth';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import tokenUtils from '~utils/tokenUtils';

export default function SecurityContent() {
    const { appLanguage } = useAppContext();
    const language = useLanguage('component.settings_content');
    const currentTokenId = Number(tokenUtils.getToken()?.split('|')[0]);
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.LOGIN_SESSIONS],
        queryFn: apiGetLoginSessions,
        refetchOnWindowFocus: false
    });
    const { mutate } = useMutation({
        mutationFn: apiRevokeLoginSession,
        onSuccess: () => {
            queryData.refetch();
        }
    });
    return (
        <>
            {
                queryData.isLoading ? <Loading /> : null
            }
            <article className={styles.article}>
                <h3>{language?.loginSession}</h3>
                <ul className={styles.sessionsList}>
                    {
                        queryData.data?.map(session => {
                            return (
                                <li key={`session-${session.id}`}>
                                    <big>
                                        <h4 style={{ marginBottom: '10px' }}>{session.name.ip}</h4>
                                    </big>
                                    {
                                        session.id === currentTokenId ?
                                            <b className={styles.currentSession}>{language?.currentSession}</b> : null
                                    }
                                    <p>{language?.lastActivedAt} {new Date(session.lastUsedAt).toLocaleString(appLanguage.language)}</p>
                                    <p>{language?.loginedAt}: {new Date(session.createdAt).toLocaleString(appLanguage.language)}</p>
                                    <p>{language?.userAgent}: {session.name.userAgent}</p>
                                    <button
                                        onClick={() => { mutate(session.id); }}
                                        className={css(appStyles.actionItemWhiteBorderRed, styles.buttonItem)}
                                    >{language?.revoke}</button>
                                </li>
                            );
                        })
                    }
                </ul>
            </article>
        </>
    );
}

import appStyles from '~styles/App.module.css';
import styles from '../styles/SettingsContent.module.css';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { apiGetLoginSessions, apiRevokeLoginSession } from '~api/auth';
import { apiDeleteLogFile, apiDownloadLogFile, apiRunArtisan } from '~api/settings';
import Loading from '~components/Loading';
import QUERY_KEYS from '~constants/query-keys';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import { saveBlob } from '~utils/saveBlob';
import tokenUtils from '~utils/tokenUtils';

export default function SettingsContent({ name }: { name: string; }) {
	const { user } = useAppContext();
	if (!user.user) return null;
	if (name === 'system') return <SystemContent />;
	if (name === 'notifications') return (
		<>
		</>
	);
	if (name === 'security') return <SecurityContent />;
	return null;
}

function SystemContent() {
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
							/>
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

function SecurityContent() {
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

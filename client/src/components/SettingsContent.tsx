import { useRef } from 'react';
import { apiDeleteLogFile, apiDownloadLogFile, apiRunArtisan } from '../api/settings';
import appStyles from '../App.module.css';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import { UserDetail } from '../models/user';
import styles from '../styles/SettingsContent.module.css';
import apiUtils from '../utils/apiUtils';
import css from '../utils/css';
import { saveBlob } from '../utils/saveBlob';

type LanguageType = ReturnType<typeof useLanguage<'component.settings_content'>>;

export default function SettingsContent({ name }: { name: string; }) {
	const { user } = useAppContext();
	const language = useLanguage('component.settings_content');
	if (!user.user) return null;
	if (name === 'system') return <SystemContent user={user.user} language={language} />;
	if (name === 'notifications') return (
		<>
		</>
	);
	return null;
}

function SystemContent({
	user,
	language
}: {
	user: UserDetail;
	language: LanguageType;
}) {
	const artisanCommandInputRef = useRef<HTMLInputElement>(null);

	const handleRunArtisan = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const command = artisanCommandInputRef.current?.value.trim();
		if (!command) return;
		const button = e.currentTarget;
		button.classList.add(appStyles['button-submitting']);
		apiRunArtisan(command)
			.finally(() => {
				button.classList.remove(appStyles['button-submitting']);
			});
	};

	const handleDownloadLogFile = () => {
		apiDownloadLogFile()
			.then(res => {
				const contentDisposition = res.contentDisposition;
				const fileName = apiUtils.getFileNameFromContentDisposition(contentDisposition, 'app.log');
				saveBlob(res.data, fileName);
			});
	};
	return (
		<>
			{
				user.role.name === 'admin' ?
					<>
						<article className={styles['article']}>
							<h3>{language?.artisancommand}</h3>
							<p>{language?.runArtisanCommand}</p>
							<label>{language?.command}</label>
							<input
								ref={artisanCommandInputRef}
								className={css(appStyles['input-d'], styles['input-item'])}
								placeholder='schedule:run'
							/>
							<div className={styles['action-items']}>
								<button
									onClick={handleRunArtisan}
									className={css(appStyles['action-item-d'], styles['button-item'])}
								>{language?.run}</button>
							</div>
						</article>
						<article className={styles['article']}>
							<h3>{language?.logFile}</h3>
							<p>{language?.logDescription}</p>
							<div className={styles['action-items']}>
								<button
									onClick={handleDownloadLogFile}
									className={css(appStyles['action-item-d'], styles['button-item'])}
								>{language?.download}</button>
								<button
									onClick={apiDeleteLogFile}
									className={css(appStyles['action-item-white-border-red-d'], styles['button-item'])}
								>{language?.delete}</button>
							</div>
						</article>
					</> : null
			}
		</>
	);
}

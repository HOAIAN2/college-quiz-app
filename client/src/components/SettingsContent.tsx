import { useState } from 'react';
import { apiDeleteLogFile, apiDownloadLogFile, apiRunArtisan } from '../api/settings';
import appStyles from '../App.module.css';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import styles from '../styles/SettingsContent.module.css';
import apiUtils from '../utils/apiUtils';
import css from '../utils/css';
import { saveBlob } from '../utils/saveBlob';

export default function SettingsContent({ name }: { name: string; }) {
	if (name === 'system') return <SystemContent />;
	return null;
}

function SystemContent() {
	const { user } = useAppContext();
	const language = useLanguage('component.system_content');
	const [artisanCommand, setArtisanCommand] = useState('');
	const handleRunArtisan = () => {
		apiRunArtisan(artisanCommand);
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
				user.user?.role.name === 'admin' ?
					<>
						<article className={styles['article']}>
							<h3>{language?.artisancommand}</h3>
							<p>{language?.runArtisanCommand}</p>
							<label>{language?.command}</label>
							<input
								value={artisanCommand}
								onInput={e => { setArtisanCommand(e.currentTarget.value); }}
								className={css(appStyles['input-d'], styles['input-item'])}
								placeholder='schedule:run'
							/>
							<button
								onClick={handleRunArtisan}
								className={css(appStyles['action-item-d'], styles['button-item'])}
							>{language?.run}</button>
						</article>
						<article className={styles['article']}>
							<h3>{language?.logFile}</h3>
							<p>{language?.logDescription}</p>
							<button
								onClick={handleDownloadLogFile}
								className={css(appStyles['action-item-d'], styles['button-item'])}
							>{language?.download}</button>
							<button
								onClick={apiDeleteLogFile}
								className={css(appStyles['action-item-white-border-red-d'], styles['button-item'])}
							>{language?.delete}</button>
						</article>
					</> : null
			}
		</>
	);
}

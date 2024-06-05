import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import appStyles from '../App.module.css';
import { apiExportUsers, apiGetUserExportableFields } from '../api/user';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import QUERY_KEYS from '../constants/query-keys';
import useLanguage from '../hooks/useLanguage';
import { RoleName } from '../models/role';
import styles from '../styles/ExportUsers.module.css';
import css from '../utils/css';
import { saveBlob } from '../utils/saveBlob';
import Loading from './Loading';

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
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setExportMode(false);
		}, TRANSITION_TIMING_FAST);
	};
	const queryData = useQuery({
		queryKey: [QUERY_KEYS.USER_EXPORTABLE_FIELDS],
		queryFn: () => apiGetUserExportableFields(role)
	});
	const handleExportUsers = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const fields: string[] = [];
		formData.forEach((value) => {
			fields.push(value as string);
		});
		apiExportUsers(role, fields)
			.then(res => {
				const fileName = `Export_${role}_${new Date().toISOString().split('T')[0]}.xlsx`;
				saveBlob(res, fileName);
			});
	};
	const handleSelectAll = (type: 'all' | 'none') => {
		document.querySelector(`.${styles['form-data']}`)
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
				styles['export-users-container'],
				hide ? styles['hide'] : ''
			)
		}>
			<div
				className={
					css(
						styles['export-users-form'],
						hide ? styles['hide'] : ''
					)
				}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{language?.selectFields}</h2>
					<div className={styles['esc-button']}
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
						<form onSubmit={handleExportUsers} className={styles['form-data']}>
							{
								queryData.data.map(item => {
									return (
										<div key={`exportable-${item.field}`} className={styles['wrap-item']}>
											<input id={item.field} type='checkbox' name='fields[]' value={item.field} />
											<label htmlFor={item.field} className={styles['label']}>{item.fieldName}</label>
										</div>
									);
								})
							}
							<div className={styles['action-items']}>
								<button
									name='save'
									className={appStyles['action-item-d']}>
									{language?.save}
								</button>
								<button
									onClick={() => { handleSelectAll('none'); }}
									style={{ width: 'fit-content' }}
									type='button' name='save'
									className={appStyles['action-item-white-d']}
								>{language?.deselectAll}
								</button>
								<button
									onClick={() => { handleSelectAll('all'); }}
									type='button' name='save'
									className={appStyles['action-item-white-d']}>
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

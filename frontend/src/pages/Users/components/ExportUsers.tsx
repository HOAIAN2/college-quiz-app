import appStyles from '@styles/App.module.css';
import styles from '../styles/ExportUsers.module.css';

import { apiExportUsers, apiGetUserExportableFields } from '@api/user';
import Loading from '@components/Loading';
import CSS_TIMING from '@constants/css-timing';
import QUERY_KEYS from '@constants/query-keys';
import useLanguage from '@hooks/useLanguage';
import { RoleName } from '@models/role';
import { useQuery } from '@tanstack/react-query';
import css from '@utils/css';
import { saveBlob } from '@utils/saveBlob';
import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

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
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setExportMode(false);
		}, CSS_TIMING.TRANSITION_TIMING_FAST);
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
		setIsPending(true);
		const defaultFileName = `Export-${role}-${new Date().toISOString().split('T')[0]}.xlsx`;
		apiExportUsers(role, fields, defaultFileName)
			.then(res => {
				saveBlob(res.data, res.fileName);
			})
			.finally(() => {
				setIsPending(false);
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
									className={
										css(
											appStyles['action-item-d'],
											isPending ? appStyles['button-submitting'] : ''
										)
									}>
									{language?.save}
								</button>
								<button
									onClick={() => { handleSelectAll('none'); }}
									style={{ width: 'fit-content' }}
									type='button'
									className={appStyles['action-item-white-d']}
								>{language?.deselectAll}
								</button>
								<button
									onClick={() => { handleSelectAll('all'); }}
									type='button'
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

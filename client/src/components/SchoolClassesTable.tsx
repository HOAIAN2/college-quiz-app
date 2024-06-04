import { useState } from 'react';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { SetURLSearchParams } from 'react-router-dom';
import appStyles from '../App.module.css';
import useAppContext from '../hooks/useAppContext';
import useLanguage from '../hooks/useLanguage';
import { Pagination } from '../models/response';
import { SchoolClassDetail } from '../models/school-class';
import styles from '../styles/global/Table.module.css';
import css from '../utils/css';
import ViewSchoolClass from './ViewSchoolClass';

type SchoolClassesTableProps = {
	data?: Pagination<SchoolClassDetail>;
	searchParams: URLSearchParams;
	onMutateSuccess: () => void;
	setSearchParams: SetURLSearchParams;
	setSelectedRows: React.Dispatch<React.SetStateAction<Set<string | number>>>;
};

export default function SchoolClassesTable({
	data,
	searchParams,
	onMutateSuccess,
	setSearchParams,
	setSelectedRows
}: SchoolClassesTableProps) {
	const { permissions } = useAppContext();
	const [checkAll, setCheckAll] = useState(false);
	const language = useLanguage('component.school_classes_table');
	const [showViewPopUp, setShowViewPopUp] = useState(false);
	const [schoolClassId, setSchoolClassId] = useState<number>(0);
	const handleViewSchoolClass = (id: number, e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
		const target = e.target as Element;
		if (target.nodeName === 'INPUT') {
			const checkBox = target as HTMLInputElement;
			const perPage = Number(searchParams.get('per_page')) || 10;
			if (checkBox.checked) setSelectedRows(pre => {
				pre.add(id);
				if (pre.size === perPage) setCheckAll(true);
				return structuredClone(pre);
			});
			else setSelectedRows(pre => {
				pre.delete(id);
				if (pre.size !== perPage) setCheckAll(false);
				return structuredClone(pre);
			});
			return;
		}
		setSchoolClassId(id);
		setShowViewPopUp(true);
	};
	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const currentTarget = e.currentTarget;
		const selector = `.${styles['column-select']}>input`;
		const allCheckBox = document.querySelectorAll(selector);
		allCheckBox.forEach(node => {
			const element = node as HTMLInputElement;
			element.checked = currentTarget.checked;
		});
		if (currentTarget.checked) {
			setSelectedRows(pre => {
				pre.clear();
				data && data.data.forEach(user => {
					pre.add(user.id);
				});
				return structuredClone(pre);
			});
			setCheckAll(true);
		}
		else {
			setSelectedRows(pre => {
				pre.clear();
				return structuredClone(pre);
			});
			setCheckAll(false);
		}
	};
	return (
		<>
			{showViewPopUp === true ?
				<ViewSchoolClass
					id={schoolClassId}
					onMutateSuccess={onMutateSuccess}
					setShowPopUp={setShowViewPopUp}
				/> : null}
			<div className={styles['table-content']}>
				<table className={styles['main']}>
					<>
						<thead>
							<tr className={styles['table-header']}>
								{
									permissions.has('school_class_delete') ?
										<th className={css(styles['column-select'], styles['column'])}>
											<input type='checkbox'
												checked={checkAll}
												onChange={handleSelectAll} />
										</th>
										: null
								}
								<th className={css(styles['column'], styles['medium'])}>
									{language?.header.shortcode}
								</th>
								<th className={css(styles['column'], styles['medium'])}>
									{language?.header.name}
								</th>
								<th className={css(styles['column'], styles['medium'])}>
									{language?.header.faculty}
								</th>
							</tr>
						</thead>
						<tbody>
							{
								data ?
									data.data.map(schoolClass => {
										return (
											<tr key={schoolClass.id}
												onClick={(e) => {
													handleViewSchoolClass(schoolClass.id, e);
												}}
											>
												{
													permissions.has('faculty_delete') ?
														<td className={css(styles['column'], styles['small'], styles['column-select'])}>
															<input type='checkbox' />
														</td>
														: null
												}
												<td className={css(styles['column'], styles['medium'])}>
													{schoolClass.shortcode}
												</td>
												<td className={css(styles['column'], styles['medium'])}>
													{schoolClass.name}
												</td>
												<td className={css(styles['column'], styles['medium'])}>
													{schoolClass.faculty.name}
												</td>
											</tr>
										);
									}) : null
							}
						</tbody>
					</>
				</table>
				{
					data ?
						<div className={styles['table-footer']}>
							<span>
								{data.from} - {data.to} / {data.total}
							</span>
							<div className={styles['table-links']}>
								{
									<div className={styles['link-content']}>
										{data.links.map(link => {
											if (isNaN(Number(link.label))) return (
												<button key={'faculty' + link.label}
													className={styles['next-previous']}
													onClick={() => {
														if (!link.url) return;
														const url = new URL(link.url);
														searchParams.set('page', url.searchParams.get('page') || '1');
														setSearchParams(searchParams);
													}}
												>
													{link.label === '...' ? '...' : link.label.includes('Next') ? <GrFormNext /> : <GrFormPrevious />}
												</button>
											);
											return (
												<button key={'faculty' + link.label}
													className={
														css(
															appStyles['button-d'],
															!link.active ? styles['inactive'] : ''
														)
													}
													onClick={() => {
														if (!link.url) return;
														const url = new URL(link.url);
														searchParams.set('page', url.searchParams.get('page') || '1');
														setSearchParams(searchParams);
													}}
												>{link.label}</button>
											);
										})}
									</div>
								}
							</div>
						</div> : null
				}
			</div>
		</>
	);
}

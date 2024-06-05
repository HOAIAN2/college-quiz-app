import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { PiStudent } from 'react-icons/pi';
import { RxCross2 } from 'react-icons/rx';
import appStyles from '../App.module.css';
import { apiUpdateCourseStudents } from '../api/course';
import { apiGetAllUser } from '../api/user';
import { AUTO_COMPLETE_DEBOUNCE } from '../config/env';
import { TRANSITION_TIMING_FAST } from '../constants/css-timing';
import QUERY_KEYS from '../constants/query-keys';
import useDebounce from '../hooks/useDebounce';
import useLanguage from '../hooks/useLanguage';
import { CourseDetail } from '../models/course';
import styles from '../styles/UpdateCourseStudents.module.css';
import css from '../utils/css';
import languageUtils from '../utils/languageUtils';
import Loading from './Loading';

type UpdateCourseStudentsProps = {
	courseDetail: CourseDetail;
	onMutateSuccess: () => void;
	setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UpdateCourseStudents({
	courseDetail,
	onMutateSuccess,
	setShowPopUp
}: UpdateCourseStudentsProps) {
	const language = useLanguage('component.update_course_students');
	const [hide, setHide] = useState(true);
	const [queryUser, setQueryUser] = useState('');
	const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE);
	const [students, setStudents] = useState(courseDetail.enrollments.map(item => item.user));
	const handleClosePopUp = () => {
		setHide(true);
		setTimeout(() => {
			setShowPopUp(false);
		}, TRANSITION_TIMING_FAST);
	};
	const handleUpdateCourseStudents = async () => {
		const studentIds = students.map(student => student.id);
		await apiUpdateCourseStudents(studentIds, courseDetail.id);
	};
	const userQueryData = useQuery({
		queryKey: [QUERY_KEYS.ALL_STUDENT, { search: debounceQueryUser }],
		queryFn: () => apiGetAllUser('student', debounceQueryUser),
	});
	const { mutate, isPending } = useMutation({
		mutationFn: handleUpdateCourseStudents,
		onSuccess: onMutateSuccess
	});
	useEffect(() => {
		setHide(false);
	}, []);
	return (
		<div className={
			css(
				styles['update-course-students-container'],
				hide ? styles['hide'] : ''
			)
		}>
			{
				isPending ? <Loading /> : null
			}
			<div className={
				css(
					styles['update-course-students-form'],
					hide ? styles['hide'] : ''
				)
			}>
				<div className={styles['header']}>
					<h2 className={styles['title']}>{language?.title}</h2>
					<div className={styles['esc-button']}
						onClick={handleClosePopUp}
					>
						<RxCross2 />
					</div>
				</div>
				<div className={styles['form-content']}>
					<input
						placeholder={language?.search}
						onInput={e => {
							setQueryUser(e.currentTarget.value);
						}}
						className={css(appStyles['input-d'], styles['input-item'])}
						type='text' />
					<div className={styles['wrap-data-container']}>
						<div className={styles['data-container']}>
							<label>{language?.joinedStudents}</label>
							<ul className={styles['joined-students-container']}>
								{
									students.map((student, index) => {
										return (
											<li
												className={styles['joined-student']}
												key={`joined-student-${student.id}`}
											>
												<div>
													<span>
														{languageUtils.getFullName(student.firstName, student.lastName)}
													</span>
													<span>
														{student.schoolClass?.shortcode}
													</span>
													<span
														style={{ height: '20px' }}
														onClick={() => {
															const newStudents = structuredClone(students);
															newStudents.splice(index, 1);
															setStudents(newStudents);
														}}
													>
														<RxCross2 />
													</span>
												</div>
											</li>
										);
									})
								}
							</ul>
							<label>{language?.allStudents}</label>
							<ul className={styles['all-student-conatiner']}>
								{userQueryData.data ?
									userQueryData.data
										.filter(user => !students.find(student => student.id === user.id))
										.map(user => (
											<li
												onClick={() => {
													const newStudents = structuredClone(students);
													newStudents.push(user);
													setStudents(newStudents);
												}}
												className={css(appStyles['dashboard-card-d'], styles['card'])}
												key={`user-${user.id}`}
											>
												<div className={styles['card-left']}>
													<PiStudent />
													<span>{languageUtils.getFullName(user.firstName, user.lastName)}</span>
													<span>{user.schoolClass?.shortcode}</span>
												</div>
											</li>
										)) : null
								}
							</ul>
						</div>
					</div>
					<div className={styles['action-items']}>
						<button
							onClick={() => { mutate(); }}
							className={
								css(
									appStyles['action-item-d'],
									isPending ? appStyles['button-submitting'] : ''
								)
							}>
							<FiSave />{language?.save}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

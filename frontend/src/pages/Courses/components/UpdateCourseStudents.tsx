import appStyles from '~styles/App.module.css';
import styles from '../styles/UpdateCourseStudents.module.css';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { PiStudent } from 'react-icons/pi';
import { RxCross2 } from 'react-icons/rx';
import { apiUpdateCourseStudents } from '~api/course';
import { apiSearchUsers } from '~api/user';
import Loading from '~components/Loading';
import { AUTO_COMPLETE_DEBOUNCE } from '~config/env';
import QUERY_KEYS from '~constants/query-keys';
import useDebounce from '~hooks/useDebounce';
import useLanguage from '~hooks/useLanguage';
import { CourseDetail } from '~models/course';
import css from '~utils/css';
import languageUtils from '~utils/languageUtils';

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
    const [queryUser, setQueryUser] = useState('');
    const debounceQueryUser = useDebounce(queryUser, AUTO_COMPLETE_DEBOUNCE);
    const [students, setStudents] = useState(courseDetail.enrollments.map(item => item.user));
    const handleClosePopUp = () => {
        setShowPopUp(false);
    };
    const handleUpdateCourseStudents = async () => {
        const studentIds = students.map(student => student.id);
        await apiUpdateCourseStudents(studentIds, courseDetail.id);
    };
    const userQueryData = useQuery({
        queryKey: [QUERY_KEYS.ALL_STUDENT, { search: debounceQueryUser }],
        queryFn: () => apiSearchUsers('student', debounceQueryUser),
    });
    const { mutate, isPending } = useMutation({
        mutationFn: handleUpdateCourseStudents,
        onSuccess: onMutateSuccess
    });
    return (
        <div className={
            css(
                styles.updateCourseStudentsContainer,
            )
        }>
            {
                isPending ? <Loading /> : null
            }
            <div className={
                css(
                    styles.updateCourseStudentsForm,
                )
            }>
                <div className={styles.header}>
                    <h2 className={styles.title}>{language?.title}</h2>
                    <div className={styles.escButton}
                        onClick={handleClosePopUp}
                    >
                        <RxCross2 />
                    </div>
                </div>
                <div className={styles.formContent}>
                    <input
                        placeholder={language?.search}
                        onInput={e => {
                            setQueryUser(e.currentTarget.value);
                        }}
                        className={css(appStyles.input, styles.inputItem)}
                        type='text' />
                    <div className={styles.wrapDataContainer}>
                        <div className={styles.dataContainer}>
                            <label>{language?.joinedStudents}</label>
                            <ul className={styles.joinedStudentsContainer}>
                                {
                                    students.map((student, index) => {
                                        return (
                                            <li
                                                className={styles.joinedStudent}
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
                            <ul className={styles.allStudentConatiner}>
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
                                                className={css(appStyles.dashboardCard, styles.card)}
                                                key={`user-${user.id}`}
                                            >
                                                <div className={styles.cardLeft}>
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
                    <div className={styles.actionItems}>
                        <button
                            onClick={() => { mutate(); }}
                            className={
                                css(
                                    appStyles.actionItem,
                                    isPending ? appStyles.buttonSubmitting : ''
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

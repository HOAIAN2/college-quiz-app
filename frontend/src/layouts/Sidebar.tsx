import styles from './styles/Sidebar.module.css';

import { useEffect } from 'react';
import {
    AiOutlineUser
} from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuSchool } from 'react-icons/lu';
import { MdOutlineStickyNote2 } from 'react-icons/md';
import {
    PiBooks,
    PiChalkboardTeacherLight,
    PiExam,
    PiStudent,
} from 'react-icons/pi';
import { RiAdminLine } from 'react-icons/ri';
import {
    RxDashboard
} from 'react-icons/rx';
import {
    SiGoogleclassroom
} from 'react-icons/si';
import { TbBrandAuth0 } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { API_HOST } from '~config/env';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import css from '~utils/css';
import getMetaContent from '~utils/getMetaContent';

const STRICT_WIDTH = 800;

export default function Sidebar() {
    const { DOM, permissions } = useAppContext();
    const language = useLanguage('component.sidebar');
    const sidebarItems = [
        {
            name: language?.dashboard,
            to: '',
            icon: <RxDashboard />,
            isActive: true
        },
        {
            name: language?.profile,
            to: 'profile',
            icon: <AiOutlineUser />,
            isActive: true
        },
        {
            name: language?.admins,
            to: 'admins',
            icon: <RiAdminLine />,
            isActive: permissions.has('user_view')
        },
        {
            name: language?.teachers,
            to: 'teachers',
            icon: <PiChalkboardTeacherLight />,
            isActive: permissions.has('user_view')
        },
        {
            name: language?.students,
            to: 'students',
            icon: <PiStudent />,
            isActive: permissions.has('user_view')
        },
        {
            name: language?.subjects,
            to: 'subjects',
            icon: <PiBooks />,
            isActive: permissions.has('subject_view')
        },
        {
            name: language?.faculty,
            to: 'faculties',
            icon: <LuSchool />,
            isActive: permissions.has('faculty_view')
        },
        {
            name: language?.schoolClass,
            to: 'school-classes',
            icon: <SiGoogleclassroom />,
            isActive: permissions.has('school_class_view')
        },
        {
            name: language?.semester,
            to: 'semesters',
            icon: <MdOutlineStickyNote2 />,
            isActive: permissions.has('semester_view')
        },
        {
            name: language?.exams,
            to: 'exams',
            icon: <PiExam />,
            isActive: permissions.has('exam_view')
        },
        {
            name: language?.permission,
            to: 'permissions',
            icon: <TbBrandAuth0 />,
            isActive: permissions.has('role_permission_view')
        },
        {
            name: language?.settings,
            to: 'settings',
            icon: <IoSettingsOutline />,
            isActive: true
        },
    ];
    useEffect(() => {
        function updateSize() {
            if (window.innerWidth < STRICT_WIDTH) DOM.sideBarRef.current?.classList.add(styles.hide);
            else DOM.sideBarRef.current?.classList.remove(styles.hide);
        }
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [DOM.sideBarRef]);
    return (
        <nav ref={DOM.sideBarRef} className={
            css(
                styles.sidebar,
                window.innerWidth < STRICT_WIDTH ? styles.hide : ''
            )
        }>
            <ul className={styles.list}>{
                sidebarItems.map((feature, index) => {
                    if (feature.isActive === false) return;
                    return (
                        <li onClick={e => {
                            e.currentTarget.querySelector('a')?.click();
                            if (window.innerWidth < STRICT_WIDTH) DOM.sideBarRef.current?.classList.add(styles.hide);
                        }} key={index} className={
                            css(
                                styles.listItem,
                                feature.to === window.location.pathname.split('/')[1] ? styles.current : ''
                            )
                        }>
                            <Link to={feature.to}>
                                {feature.icon}
                                {feature.name}
                            </Link>
                        </li>
                    );
                })
            }</ul>
            <div className={styles.footer}>
                <div className={styles.links}>
                    <a target='_blank' href={`${API_HOST}/term`}>{language?.term}</a>
                    <a target='_blank' href={`${API_HOST}/privacy`}>{language?.privacy}</a>
                    <a target='_blank' href={`${API_HOST}/security`}>{language?.security}</a>
                    <a target='_blank' href="https://hoaian2.netlify.app/">{language?.contact}</a>
                    <a target='_blank' href="https://github.com/HOAIAN2/college-quiz-app">{language?.docs}</a>
                </div>
                <div className={styles.appInfos}>
                    <small>App version: {__APP_VERSION__}</small> <br />
                    <small>Build date: {__APP_BUILD_DATE__}</small> <br />
                    <small>&#169; {new Date(__APP_BUILD_DATE__).getFullYear()} {getMetaContent('author')}</small>
                </div>
            </div>
        </nav>
    );
}

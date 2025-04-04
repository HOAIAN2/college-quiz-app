import styles from './styles/Header.module.css';
import sidebarStyles from './styles/Sidebar.module.css';

import { useEffect, useRef } from 'react';
import {
    BiLogOut
} from 'react-icons/bi';
import { LuCircleUserRound } from 'react-icons/lu';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Link } from 'react-router';
import { apiLogout } from '~api/auth';
import CustomSelect from '~components/CustomSelect';
import useAppContext from '~hooks/useAppContext';
import useLanguage from '~hooks/useLanguage';
import languageUtils from '~utils/language-utils';

export default function Header() {
    const { DOM, user, appLanguage, appTitle } = useAppContext();
    const language = useLanguage('component.header');
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const handleLogout = () => {
        apiLogout()
            .finally(() => {
                window.location.pathname = '/';
            });
    };
    const handleToggleDropdownProfile = () => {
        profileDropdownRef.current?.classList.toggle(styles.show);
    };
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const element = e.target as HTMLElement;
            if (element && !profileDropdownRef.current?.contains(element)) {
                profileDropdownRef.current?.classList.remove(styles.show);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return (
        <header className={styles.header}>
            <div id='loader'></div>
            <div className={styles.leftItems}>
                {
                    user.user ?
                        <>
                            <div className={styles.toggle} onClick={() => {
                                DOM.sideBarRef.current?.classList.toggle(sidebarStyles.hide);
                            }}>
                                <RxHamburgerMenu />
                            </div>
                        </> : null
                }
                <Link to='/'>
                    <img style={{ userSelect: 'none' }} height={30} src={'/favicon.ico'} alt="app icon" />
                </Link>
                <h1 className={styles.appTitle}>{appTitle.title}</h1>
            </div>
            <div className={styles.rightItems}>
                <div>
                    <CustomSelect
                        defaultOption={languageUtils.languageCodeName.find(lang => lang.value === appLanguage.language)!}
                        options={languageUtils.languageCodeName}
                        className={styles.selectLanguage}
                        onChange={option => {
                            appLanguage.setLanguage(option.value);
                            languageUtils.setLanguage(option.value);
                        }}
                    />
                </div>
                {
                    user.user ?
                        <>
                            <div
                                ref={profileDropdownRef}
                                onClick={handleToggleDropdownProfile} className={styles.profileItem}>
                                <LuCircleUserRound />
                                <div className={styles.userFullName}>{languageUtils.getFullName(user.user.firstName, user.user.lastName)}</div>
                                <div onClick={handleToggleDropdownProfile} className={styles.dropDown}>
                                    <Link
                                        onClick={handleToggleDropdownProfile}
                                        to='/profile'
                                        className={styles.dropItem}
                                        title={languageUtils.getFullName(user.user?.firstName, user.user?.lastName)}
                                    >
                                        <LuCircleUserRound />
                                        <span>{language?.profile}</span>
                                    </Link>
                                    <div onClick={handleLogout} className={styles.dropItem}>
                                        <BiLogOut style={{ color: 'var(--color-red)' }} />
                                        <span>{language?.logout}</span>
                                    </div>
                                </div>
                            </div>
                        </> : null
                }
            </div>
        </header>
    );
}

import styles from './styles/AuthLayout.module.css';

import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { apiGetUser } from '~api/user';
import useAppContext from '~hooks/useAppContext';
import Header from './Header';

export default function AuthLayout() {
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, permissions } = useAppContext();
    useEffect(() => {
        const prePage = location.state?.from;
        apiGetUser()
            .then(data => {
                user.setUser(data.user);
                permissions.setPermissions(data.permissions);
                navigate(prePage?.pathname || '/');
            })
            .catch(() => {
                document.querySelector('.pre-load-container')?.classList.add('hide');
                setChecking(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (checking) return null;
    return (
        <div className={styles.authLayout}>
            <Header />
            <Outlet />
        </div >
    );
}

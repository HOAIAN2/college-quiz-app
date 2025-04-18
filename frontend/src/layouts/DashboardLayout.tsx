import styles from './styles/DashboardLayout.module.css';

import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { apiGetUser } from '../api/user';
import useAppContext from '../hooks/useAppContext';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
    const { user, permissions } = useAppContext();
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        apiGetUser()
            .then(data => {
                user.setUser(data.user);
                permissions.setPermissions(data.permissions);
                setChecking(false);
                document.querySelector('.pre-load-container')?.classList.add('hide');
            })
            .catch(() => {
                setChecking(false);
                navigate('/auth/login', { state: { from: location.pathname } });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (checking) return null;
    return (
        <div className={styles.dashboardLayout}>
            <Header />
            <div className={styles.dashboardContent}>
                <Sidebar />
                <Outlet />
            </div>
        </div>
    );
}

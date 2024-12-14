import './styles/App.module.css';

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { lazy, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import themeUtils from '~utils/themeUtils';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Login from './pages/Auth/Login';
import VerifyEmail from './pages/Auth/VerifyEmail';
import NotFound from './pages/Errors/NotFound';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Users = lazy(() => import('./pages/Users/Users'));
const Permissisons = lazy(() => import('./pages/Permissisons/Permissisons'));
const RolePermissions = lazy(() => import('./pages/Permissisons/RolePermissions'));
const Faculties = lazy(() => import('./pages/Faculties/Faculties'));
const SchoolClasses = lazy(() => import('./pages/SchoolClasses/SchoolClasses'));
const Subjects = lazy(() => import('./pages/Subjects/Subjects'));
const Subject = lazy(() => import('./pages/Subjects/Subject'));
const Questions = lazy(() => import('./pages/Questions/Questions'));
const Semesters = lazy(() => import('./pages/Semesters/Semesters'));
const Courses = lazy(() => import('./pages/Courses/Courses'));
const Course = lazy(() => import('./pages/Courses/Course'));
const Semester = lazy(() => import('./pages/Semesters/Semester'));
const Exams = lazy(() => import('./pages/Exams/Exams'));
const Exam = lazy(() => import('./pages/Exams/Exam'));
const TakeExam = lazy(() => import('./pages/Exams/TakeExam'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

const router = createBrowserRouter([
    {
        errorElement: <NotFound />,
        children: [
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <Login />
                    },
                    {
                        path: 'verify-email',
                        element: <VerifyEmail />
                    },
                    {
                        path: 'forgot-password',
                        element: <ForgotPassword />
                    },
                ]
            },
            {
                path: '/',
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: 'subjects',
                        children: [
                            {
                                index: true,
                                element: <Subjects />
                            },
                            {
                                path: ':id',
                                children: [
                                    {
                                        index: true,
                                        element: <Subject />
                                    },
                                    {
                                        path: 'questions',
                                        element: <Questions />
                                    }
                                ],
                            }
                        ]
                    },
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'faculties',
                        element: <Faculties />
                    },
                    {
                        path: 'school-classes',
                        element: <SchoolClasses />
                    },
                    {
                        path: 'semesters',
                        children: [
                            {
                                index: true,
                                element: <Semesters />
                            },
                            {
                                path: ':id',
                                children: [
                                    {
                                        index: true,
                                        element: <Semester />
                                    },
                                    {
                                        path: 'courses',
                                        children: [
                                            {
                                                index: true,
                                                element: <Courses />
                                            },
                                            {
                                                path: ':courseId',
                                                element: <Course />
                                            }
                                        ],
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: 'exams',
                        children: [
                            {
                                index: true,
                                element: <Exams />
                            },
                            {
                                path: ':id',
                                children: [
                                    {
                                        index: true,
                                        element: <Exam />
                                    },
                                    {
                                        path: 'take',
                                        element: <TakeExam />
                                    },
                                ]
                            }
                        ],
                    },
                    {
                        path: 'teachers',
                        element: <Users role='teacher' />
                    },
                    {
                        path: 'students',
                        element: <Users role='student' />
                    },
                    {
                        path: 'admins',
                        element: <Users role='admin' />
                    },
                    {
                        path: 'permissions',
                        children: [
                            {
                                index: true,
                                element: <Permissisons />
                            },
                            {
                                path: ':id',
                                element: <RolePermissions />
                            },
                        ],
                    },
                    {
                        path: 'settings',
                        element: <Settings />,
                        children: [
                            {
                                index: true,
                                element: <Settings />
                            },
                            {
                                path: ':name',
                                element: <Settings />
                            },
                        ],
                    },
                ]
            }
        ]
    }
]);

const queryClient = new QueryClient();

export default function App() {
    useEffect(() => {
        const primaryColor = themeUtils.getPrimaryColor();
        if (primaryColor) {
            themeUtils.setPrimaryColor(primaryColor);
        }
    }, []);
    return (
        <>
            <Toaster
                richColors
                closeButton
                visibleToasts={5}
                position='bottom-left'
                toastOptions={{
                    duration: 3000
                }}
            />
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </>
    );
}

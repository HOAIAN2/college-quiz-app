import './styles/App.module.css';

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import SuspenseLoading from '~components/SuspenseLoading';
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
const ExamResult = lazy(() => import('./pages/Exams/ExamResult'));
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
                        element: <Suspense key='dashboard' fallback={<SuspenseLoading />}><Dashboard /></Suspense>
                    },
                    {
                        path: 'subjects',
                        children: [
                            {
                                index: true,
                                element: <Suspense key='subjects' fallback={<SuspenseLoading />}><Subjects /></Suspense>
                            },
                            {
                                path: ':id',
                                children: [
                                    {
                                        index: true,
                                        element: <Suspense key='subject' fallback={<SuspenseLoading />}><Subject /></Suspense>
                                    },
                                    {
                                        path: 'questions',
                                        element: <Suspense key='questions' fallback={<SuspenseLoading />}><Questions /></Suspense>
                                    }
                                ],
                            }
                        ]
                    },
                    {
                        path: 'profile',
                        element: <Suspense key='profile' fallback={<SuspenseLoading />}><Profile /></Suspense>
                    },
                    {
                        path: 'faculties',
                        element: <Suspense key='faculties' fallback={<SuspenseLoading />}><Faculties /></Suspense>
                    },
                    {
                        path: 'school-classes',
                        element: <Suspense key='school-classes' fallback={<SuspenseLoading />}><SchoolClasses /></Suspense>
                    },
                    {
                        path: 'semesters',
                        children: [
                            {
                                index: true,
                                element: <Suspense key='semesters' fallback={<SuspenseLoading />}><Semesters /></Suspense>
                            },
                            {
                                path: ':id',
                                children: [
                                    {
                                        index: true,
                                        element: <Suspense key='semester' fallback={<SuspenseLoading />}><Semester /></Suspense>
                                    },
                                    {
                                        path: 'courses',
                                        children: [
                                            {
                                                index: true,
                                                element: <Suspense key='courses' fallback={<SuspenseLoading />}><Courses /></Suspense>
                                            },
                                            {
                                                path: ':courseId',
                                                element: <Suspense key='course' fallback={<SuspenseLoading />}><Course /></Suspense>
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
                                element: <Suspense key='exams' fallback={<SuspenseLoading />}><Exams /></Suspense>
                            },
                            {
                                path: ':id',
                                children: [
                                    {
                                        index: true,
                                        element: <Suspense key='exam' fallback={<SuspenseLoading />}><Exam /></Suspense>
                                    },
                                    {
                                        path: 'take',
                                        element: <Suspense key='take-exam' fallback={<SuspenseLoading />}><TakeExam /></Suspense>
                                    },
                                    {
                                        path: ':resultId',
                                        element: <Suspense key='exam-result' fallback={<SuspenseLoading />}><ExamResult /></Suspense>
                                    },
                                ]
                            }
                        ],
                    },
                    {
                        path: 'teachers',
                        element: <Suspense key='users' fallback={<SuspenseLoading />}><Users role='teacher' /></Suspense>
                    },
                    {
                        path: 'students',
                        element: <Suspense key='users' fallback={<SuspenseLoading />}><Users role='student' /></Suspense>
                    },
                    {
                        path: 'admins',
                        element: <Suspense key='users' fallback={<SuspenseLoading />}><Users role='admin' /></Suspense>
                    },
                    {
                        path: 'permissions',
                        children: [
                            {
                                index: true,
                                element: <Suspense key='permissions' fallback={<SuspenseLoading />}><Permissisons /></Suspense>
                            },
                            {
                                path: ':id',
                                element: <Suspense key='role-permissions' fallback={<SuspenseLoading />}><RolePermissions /></Suspense>
                            },
                        ],
                    },
                    {
                        path: 'settings',
                        element: <Suspense key='settings' fallback={<SuspenseLoading />}><Settings /></Suspense>,
                        children: [
                            {
                                index: true,
                                element: <Suspense key='settings' fallback={<SuspenseLoading />}><Settings /></Suspense>
                            },
                            {
                                path: ':name',
                                element: <Suspense key='settings' fallback={<SuspenseLoading />}><Settings /></Suspense>
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

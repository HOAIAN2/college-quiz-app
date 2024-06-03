import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import moment from 'moment';
import 'moment/dist/locale/vi';
import { Suspense, lazy } from 'react';
import 'react-datetime/css/react-datetime.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
// import './App.css'
import './App.module.css';
import SuspenseLoading from './components/SuspenseLoading';
import useAppContext from './hooks/useAppContext';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const Permissisons = lazy(() => import('./pages/Permissisons'));
const RolePermissions = lazy(() => import('./pages/RolePermissions'));
const Faculties = lazy(() => import('./pages/Faculties'));
const SchoolClasses = lazy(() => import('./pages/SchoolClasses'));
const Subjects = lazy(() => import('./pages/Subjects'));
const Subject = lazy(() => import('./pages/Subject'));
const Questions = lazy(() => import('./pages/Questions'));
const Semesters = lazy(() => import('./pages/Semesters'));
const Courses = lazy(() => import('./pages/Courses'));
const Course = lazy(() => import('./pages/Course'));
const Semester = lazy(() => import('./pages/Semester'));
const Exams = lazy(() => import('./pages/Exams'));
const Exam = lazy(() => import('./pages/Exam'));
const TakeExam = lazy(() => import('./pages/TakeExam'));

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
					}
				]
			},
			{
				path: '/',
				element: <DashboardLayout />,
				children: [
					{
						index: true,
						element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>,
					},
					{
						path: 'subjects',
						children: [
							{
								index: true,
								element: <Suspense fallback={<SuspenseLoading />}><Subjects /></Suspense>
							},
							{
								path: ':id',
								children: [
									{
										index: true,
										element: <Suspense fallback={<SuspenseLoading />}><Subject /></Suspense>
									},
									{
										path: 'questions',
										element: <Suspense fallback={<SuspenseLoading />}><Questions /></Suspense>
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
						element: <Suspense fallback={<SuspenseLoading />}><Faculties /></Suspense>
					},
					{
						path: 'school-classes',
						element: <Suspense fallback={<SuspenseLoading />}><SchoolClasses /></Suspense>
					},
					{
						path: 'semesters',
						children: [
							{
								index: true,
								element: <Suspense fallback={<SuspenseLoading />}><Semesters /></Suspense>
							},
							{
								path: ':id',
								children: [
									{
										index: true,
										element: <Suspense fallback={<SuspenseLoading />}><Semester /></Suspense>,
									},
									{
										path: 'courses',
										children: [
											{
												index: true,
												element: <Suspense fallback={<SuspenseLoading />}><Courses /></Suspense>,
											},
											{
												path: ':courseId',
												element: <Suspense fallback={<SuspenseLoading />}><Course /></Suspense>
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
								element: <Suspense fallback={<SuspenseLoading />}><Exams /></Suspense>
							},
							{
								path: ':id',
								children: [
									{
										index: true,
										element: <Suspense fallback={<SuspenseLoading />}><Exam /></Suspense>
									},
									{
										path: 'take',
										element: <Suspense fallback={<SuspenseLoading />}><TakeExam /></Suspense>
									},
								]
							}
						],
					},
					{
						path: 'teachers',
						element: <Suspense fallback={<SuspenseLoading />}><Users role='teacher' /></Suspense>
					},
					{
						path: 'students',
						element: <Suspense fallback={<SuspenseLoading />}><Users role='student' /></Suspense>
					},
					{
						path: 'permissions',
						children: [
							{
								index: true,
								element: <Suspense fallback={<SuspenseLoading />}><Permissisons /></Suspense>
							},
							{
								path: ':id',
								element: <Suspense fallback={<SuspenseLoading />}><RolePermissions /></Suspense>
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
	const { appLanguage } = useAppContext();
	moment.locale(appLanguage.language);
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

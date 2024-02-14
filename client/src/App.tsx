import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import 'react-datetime/css/react-datetime.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import './App.css'
import SuspenseLoading from './components/SuspenseLoading'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/Users'))
const Permisisons = lazy(() => import('./pages/Permisisons'))
const RolePermissions = lazy(() => import('./pages/RolePermissions'))
const Faculties = lazy(() => import('./pages/Faculties'))
const SchoolClasses = lazy(() => import('./pages/SchoolClasses'))
const Subjects = lazy(() => import('./pages/Subjects'))
const Subject = lazy(() => import('./pages/Subject'))

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
								element: <Suspense fallback={<SuspenseLoading />}><Subject /></Suspense>
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
						path: 'courses',
						element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
					},
					{
						path: 'exams',
						element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
					},
					{
						path: 'questions',
						element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
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
								element: <Suspense fallback={<SuspenseLoading />}><Permisisons /></Suspense>
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
])

const queryClient = new QueryClient()

export default function App() {
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
	)
}

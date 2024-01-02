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
import DasboardLayout from './layouts/DasboardLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/Users'))

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
        element: <DasboardLayout />,
        children: [
          {
            index: true,
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>,
          },
          {
            path: 'subjects',
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
          },
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'courses',
            element: <Suspense fallback={<SuspenseLoading />}><Dashboard /></Suspense>
          },
          {
            path: 'profile',
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
        ]
      }
    ]
  }
])
const queryClient = new QueryClient()
function App() {
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

export default App

import { Suspense, lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DasboardLayout from './layouts/DasboardLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import './App.css'
import Loading from './components/Loading'
const Dashboard = lazy(() => import('./pages/Dashboard'))

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
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>,
          },
          {
            path: 'subjects',
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
          },
          {
            path: 'courses',
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
          },
          {
            path: 'profile',
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
          },
          {
            path: 'exams',
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
          },
          {
            path: 'questions',
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
          },
          {
            path: 'teachers',
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
          },
          {
            path: 'students',
            element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>
          },
        ]
      }
    ]
  }
])
function App() {
  return (
    // <Suspense fallback={<Loading />}>
    <RouterProvider router={router} />
    // </Suspense>
  )
}

export default App

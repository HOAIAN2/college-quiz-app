import { Suspense, lazy, useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DasboardLayout from './layouts/DasboardLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import './App.css'
import Loading from './components/Loading'
const Home = lazy(() => import('./pages/Home'))

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
            element: <Suspense fallback={<Loading />}><Home /></Suspense>,
            // element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense>,
          },
          {
            path: 'subjects',
            element: <Home />
          },
          {
            path: 'subjects',
            element: <Home />
          },
          {
            path: 'subjects',
            element: <Home />
          }
        ]
      }
    ]
  }
])
function App() {
  useEffect(() => {
    document.querySelectorAll('.loading-container, .pre-load').forEach(node => {
      node.remove()
    })
  })
  return (
    // <Suspense fallback={<Loading />}>
    <RouterProvider router={router} />
    // </Suspense>
  )
}

export default App

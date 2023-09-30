import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { useUserData } from './contexts/hooks'
import { reqGetUser } from './utils/user'
import { USER_ACTION } from './contexts/UserContext'
import './App.css'


function App() {
  const { dispatchUser } = useUserData()
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    reqGetUser()
      .then(data => {
        dispatchUser({ type: USER_ACTION.SET, payload: data })
        setIsFirstLoad(false)
      })
      .catch(() => {
        setIsFirstLoad(false)
        navigate('/login')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (isFirstLoad) return
    const items = document.querySelectorAll('.loading, .pre-load')
    items.forEach(node => { node.remove() })
  }, [isFirstLoad])
  if (isFirstLoad) return null
  document.querySelector('.loading-container')?.remove()
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Home />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

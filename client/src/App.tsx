import './App.css'
import toast from './utils/toast'


function App() {
  document.querySelector('.loading-container')?.remove()
  return (
    <>
      <button onClick={() => toast.success('Mesage')}>
        Success
      </button>
      <button onClick={() => toast.error('Mesage')}>
        Error
      </button>
      <button onClick={() => toast.alert('Mesage')}>
        Alert
      </button>
    </>
  )
}

export default App

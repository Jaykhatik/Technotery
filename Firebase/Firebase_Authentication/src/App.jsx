import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Upload from './components/Upload'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/upload' element={<Upload/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
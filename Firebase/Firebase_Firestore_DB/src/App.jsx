// import { getAuth } from 'firebase/auth';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddCollection from './pages/AddCollection'
import GetCollection from './pages/GetCollection'
import SingleCollection from './pages/SingleCollection'
function App() {
  // const auth = getAuth(app);
  // console.log(auth);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AddCollection />} />
          <Route path='/getCollection' element={<GetCollection />} />
          <Route path='/SingleCollection/:id' element={<SingleCollection/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
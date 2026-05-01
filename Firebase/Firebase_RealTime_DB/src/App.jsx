import React from 'react'
import { getAuth } from 'firebase/auth';
import app, { realTimeDb } from './Utils/Firebase';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateData from './Pages/CreateData';
import GetData from './Pages/GetData';
import SingleData from './Pages/SingleData';

function App() {
  const auth = getAuth(app);
  console.log(auth);
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<CreateData/>}/>
      <Route path='/getData' element={<GetData/>}/>
      <Route path='/SingleData/:id' element={<SingleData/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
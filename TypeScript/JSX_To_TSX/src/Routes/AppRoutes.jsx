import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import Home from '../Pages/Home/Home'
import Products from '../Pages/Product/Products';
import Users from '../Pages/Users/Users'

function AppRoutes() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<><Header /><Home /><Footer /></>} />
          <Route path='/products' element={<><Header /><Products /><Footer /></>} />
          <Route path='/user' element={<><Header /><Users /><Footer /></>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default AppRoutes;
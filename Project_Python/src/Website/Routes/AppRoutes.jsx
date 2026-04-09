import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Hero from '../Pages/Home/Home'
import Product from '../Pages/Products/Product'
import ProductDetail from '../Pages/Products/ProductDetail'
import Cart from '../Pages/Cart/Cart'
import Login from '../../Auth/Login'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import Dashboard from '../../Seller/Pages/Dashboard/Dashboard'
import AdminLayout from '../../Admin/Layout/AdminLayout'
import AdminDashboard from '../../Admin/Pages/Dashboard/Dashboard'
import SellerLayout from '../../Seller/Layout/SellerLayout'
import Orders from '../../Admin/Pages/Orders/Order'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><Header /><Hero /><Footer /></>} />
        <Route path='/product' element={<><Header /><Product /><Footer /></>} />
        <Route path='/product/:uuid' element={<><Header /><ProductDetail /><Footer /></>} />
        <Route path='/cart' element={<><Header /><Cart /><Footer /></>} />
        <Route path='/login' element={<><Header /><Login /><Footer /></>} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='orders' element={<Orders/>}/>
        </Route>
        <Route path='/seller' element={< SellerLayout/>}>
          <Route path='dashboard' element={<Dashboard/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
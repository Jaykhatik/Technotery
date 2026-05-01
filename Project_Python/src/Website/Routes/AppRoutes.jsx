import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Hero from '../Pages/Home/Home'
import Product from '../Pages/Products/Product'
import ProductDetail from '../Pages/Products/ProductDetail'
import Cart from '../Pages/Cart/Cart'
import Login from '../../Auth/Login'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import AdminDashboard from '../../Admin/Pages/Dashboard/Dashboard'
import Orders from '../../Admin/Pages/Orders/Order'
import Categories from '../../Admin/Pages/Categories/Categories'
import ProductsAdmin from '../../Admin/Pages/Products/ProductsAdmin'
import Sellers from '../../Admin/Pages/Sellers/Sellers'
import SellerDashboard from '../../Seller/Pages/Dashboard/Dashboard'
import SellerProducts from '../../Seller/Pages/Products/SellerProducts'
import DashboardLayout from '../../Layout/DashboardLayout'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><Header /><Hero /><Footer /></>} />
        <Route path='/product' element={<><Header /><Product /><Footer /></>} />
        <Route path='/product/:uuid' element={<><Header /><ProductDetail /><Footer /></>} />
        <Route path='/cart' element={<><Header /><Cart /><Footer /></>} />
        <Route path='/login' element={<><Header /><Login /><Footer /></>} />

        {/* admin */}
        <Route path='/admin' element={<DashboardLayout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='orders' element={<Orders/>}/>
          <Route path='categories' element={<Categories/>}/>
          <Route path='products' element={<ProductsAdmin/>}/>
          <Route path='sellers' element={<Sellers/>}/>
        </Route>

        {/* seller */}
        <Route path='/seller' element={<DashboardLayout/>}>
          <Route path='dashboard' element={<SellerDashboard/>} />
          <Route path='products' element={<SellerProducts/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

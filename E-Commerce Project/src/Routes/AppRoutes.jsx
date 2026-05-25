import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Hero from '../Website/Pages/Home/Home'
import Product from '../Website/Pages/Products/Product'
import ProductDetail from '../Website/Pages/Products/ProductDetail'
import Cart from '../Website/Pages/Cart/Cart'
import Header from '../Website/Components/Header/Header'
import Footer from '../Website/Components/Footer/Footer'
import AdminDashboard from '../Admin/Pages/Dashboard/Dashboard'
import Orders from '../Admin/Pages/Orders/Order'
import Categories from '../Admin/Pages/Categories/Categories'
import ProductsAdmin from '../Admin/Pages/Products/ProductsAdmin'
import Sellers from '../Admin/Pages/Sellers/Sellers'
import SellerDashboard from '../Seller/Pages/Dashboard/Dashboard'
import SellerProducts from '../Seller/Pages/Products/SellerProducts'
import DashboardLayout from '../Layout/DashboardLayout'
import Login from '../Auth/Pages/Login'
import Profile from '../Website/Pages/Customer/Profile'
import Wishlist from '../Website/Pages/Customer/Whislist/Wishlist'
import Requests from '../Admin/Pages/Requests/Request'
import AllRequests from '../Admin/Pages/Requests/AllRequests/Allrequest'
import SellerCategories from '../Seller/Pages/Categories/CategoriesReq'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><Header /><Hero /><Footer /></>} />
        <Route path='/product' element={<><Header /><Product /><Footer /></>} />
        <Route path='/product/:uuid' element={<><Header /><ProductDetail /><Footer /></>} />
        <Route path='/cart' element={<><Header /><Cart /><Footer /></>} />
        <Route path='/login' element={<><Header /><Login /><Footer /></>} />
        <Route path='/profile' element={<><Header/><Profile/><Footer/></>}/>
        <Route path='/wishlist' element={<><Header/><Wishlist/><Footer/></>}/>

        {/* admin */}
        <Route path='/admin' element={<DashboardLayout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='orders' element={<Orders/>}/>
          <Route path='categories' element={<Categories/>}/>
          <Route path='requests' element={<Requests/>}/>
          <Route path='allRequests' element={<AllRequests/>}/>
          <Route path='products' element={<ProductsAdmin/>}/>
          <Route path='sellers' element={<Sellers/>}/>
        </Route>

        {/* seller */}
        <Route path='/seller' element={<DashboardLayout/>}>
          <Route path='dashboard' element={<SellerDashboard/>} />
          <Route path='products' element={<SellerProducts/>}/>
          <Route path='categories' element={<SellerCategories/>}/>
          {/* <Route path='products/:uuid' element={<SellerProductDetail/>}/> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

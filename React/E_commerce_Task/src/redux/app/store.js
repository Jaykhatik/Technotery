import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/productSlice'
import cartReducer from '../features/cartSlice'
import userReducer from '../features/userSlice'

export const store = configureStore({
    reducer: {
        products: productReducer,
        carts: cartReducer,
        users : userReducer
    }
})

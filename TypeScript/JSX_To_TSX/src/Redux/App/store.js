import { configureStore } from "@reduxjs/toolkit";
import productReducer  from '../Features/ProductSlice'

export const store = configureStore({
    reducer: {
        products : productReducer,
    }
}) 
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchProducts from "../../Services/ProductService";

 export const getProducts = createAsyncThunk(
    "products/getProducts",
    async () => {
        const data = await fetchProducts();
        return data;
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        addProduct: (state, action) => {
            state.items.push(action.payload);
        },

        updateProduct: (state, action) => {
            const index = state.items.findIndex(
                (item) => item.id === action.payload.id
            );
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },

        deleteProduct: (state, action) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(getProducts.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch products";
            });
    },
})
export const { addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
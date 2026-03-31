import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../../services/cartService"; 

// ✅ async thunk (API call)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const data = await getProducts();
    return data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        // console.log(state.data)
      })
      .addCase(fetchProducts.rejected, (state,action) => {
        state.loading = false;
        state.error = action.error.message;
        // console.log(state.error)
      });
  },
});
 
export default productSlice.reducer;
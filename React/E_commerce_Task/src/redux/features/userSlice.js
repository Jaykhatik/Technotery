import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../../services/UserServices";

// ✅ fetch users (API)
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const data = await getUsers();
    return data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      state.users = state.users.map((u) =>
        u.id === action.payload.id ? action.payload : u
      );
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0
    },
    reducers: {//functions in which we work and it is an object
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementByAmount: (state,actions) => {
            state.value += actions.payload;
        }
    }
})

export const { increment, decrement ,incrementByAmount} = counterSlice.actions
export default counterSlice.reducer
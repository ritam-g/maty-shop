import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isLoading: false,
        error: null
    },
    reducers: {
        setUser:(state, action) => {
            state.user = action.payload
        },
        setLoading:(state, action) => {
            state.isLoading = action.payload
        },
        setError:(state, action) => {
            state.error = action.payload
        }

    }
})

export const {setUser, setLoading, setError} = authSlice.actions
export default authSlice
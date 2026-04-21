import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isLoading: true,
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
        },
        clearError:(state) => {
            state.error = null
        }

    }
})

export const {setUser, setLoading, setError, clearError} = authSlice.actions
export default authSlice.reducer

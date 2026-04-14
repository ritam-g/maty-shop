import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    product: [],
    isLoading: false,
    error: null
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.product = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setProduct, setLoading, setError } = productSlice.actions
export default productSlice.reducer
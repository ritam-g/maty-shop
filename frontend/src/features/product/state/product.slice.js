import { createSlice } from '@reduxjs/toolkit'



const initialState = {
    product: [],
    allProducts:[],
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
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload
        }
    }
})

export const { setProduct, setLoading, setError, setAllProducts } = productSlice.actions
export default productSlice.reducer
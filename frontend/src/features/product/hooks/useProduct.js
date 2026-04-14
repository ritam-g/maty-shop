import { useDispatch } from "react-redux"
import { createProduct, getProduct } from "../services/product.api"
import { setError, setLoading, setProduct } from "../state/product.slice"

export function UseProduct() {
    const dispatch = useDispatch()
    async function createProductHandeler(productDetails) {
        dispatch(setLoading(true))
        try {
            const data = await createProduct(productDetails)
            dispatch(setProduct(data.products))
        } catch (error) {
            dispatch(setError(error.message))
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function getProductHandeler() {
        dispatch(setLoading(true))
        try {
            const data = await getProduct()
            dispatch(setProduct(data.products))
        } catch (error) {
            dispatch(setError(error.message))
        }
        finally {
            dispatch(setLoading(false))
        }
    }
    return { createProductHandeler, getProductHandeler }
}
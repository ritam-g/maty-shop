import { useDispatch } from "react-redux"
import { createProduct, getAllProducts, getProduct } from "../services/product.api"
import { setError, setLoading, setProduct, setAllProducts } from "../state/product.slice"

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
    async function getAllProductHandeller() {
        try {
            dispatch(setLoading(true))
            const data = await getAllProducts()
            dispatch(setAllProducts(data.products))
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }
    return { createProductHandeler, getProductHandeler , getAllProductHandeller}
}
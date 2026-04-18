import { useDispatch } from "react-redux"
import { addVearientProduct, createProduct, getAllProducts, getProduct, getProductById } from "../services/product.api"
import { setError, setLoading, setProduct, setAllProducts } from "../state/product.slice"
import { useCallback } from "react"

export function UseProduct() {
    const dispatch = useDispatch()
    async function createProductHandeler(productDetails) {
        dispatch(setLoading(true))
        try {
            const data = await createProduct(productDetails)
            dispatch(setProduct(data.products))
            return data.success
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
    const getAllProductHandeller = useCallback(async () => {
    try {
        dispatch(setLoading(true));
        const data = await getAllProducts();
        dispatch(setAllProducts(data.products));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
}, [dispatch]);

    async function getProductByIdHandeller(productId) {
        dispatch(setLoading(true))
        try {
            const data = await getProductById(productId)
            dispatch(setProduct(data.product))
            return data.product
        } catch (error) {
            const message = error?.response?.data?.message || error.message
            dispatch(setError(message))
            return null
        }
        finally {
            dispatch(setLoading(false))
        }
    }
    async function updateProductVarientHandeler(data, productId) {

        const formData = new FormData();

        formData.append("title", data.name);
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("currency", data.currency);

        formData.append("attributes", JSON.stringify(data.attributes || {}));

        if (data.images && data.images.length > 0) {
            data.images.forEach((file) => {
                formData.append("images", file);
            });
        }

        try {
            dispatch(setLoading(true));

            const res = await addVearientProduct(formData, productId);

            dispatch(setProduct(res.updatedProduct));

            return res;

        } catch (error) {
            console.log(error);

            const message =
                error?.response?.data?.message || error.message;

            dispatch(setError(message));

            return null;

        } finally {
            dispatch(setLoading(false));
        }
    }
    return { createProductHandeler, getProductHandeler, getAllProductHandeller, getProductByIdHandeller, updateProductVarientHandeler }
}

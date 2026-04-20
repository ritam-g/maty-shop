import { setError, setItems, setLoading } from "../state/cart.slice";
import { useDispatch } from "react-redux";
import { getCart, addToCart } from "../services/cart.api";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleGetCart() {
        dispatch(setLoading(true));
        try {
            const data = await getCart();
            dispatch(setItems(data.cart));
            return data;
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleAddToCart({ productId, variantId, quantity = 1 }) {
        dispatch(setLoading(true));
        try {
            const data = await addToCart({ productId, variantId, quantity });
            dispatch(setItems(data.cart));
            return data;
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
    return {
        handleGetCart,
        handleAddToCart
    }

}
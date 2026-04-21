import { useDispatch } from "react-redux"
import { getMe, login, register } from "../services/authApi.service.js"
import { setLoading, setUser, setError } from "../store/auth.slice.js"

/**
 * Function Name: useAuth
 * Purpose: Wrap authentication API calls and sync user session state into Redux.
 * Returns:
 * - Auth action handlers for register, login, and session restore
 */
function useAuth() {

    const dispatch = useDispatch()

    /**
     * Function Name: handleRegister
     * Purpose: Register a new user and store the returned user object in Redux.
     */
    async function handleRegister({ name, email, password, role, contact }) {
        dispatch(setLoading(true))
        try {
            const data = await register({ name, email, password, role, contact })
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }

    }

    /**
     * Function Name: handleLogin
     * Purpose: Log in a user and hydrate Redux auth state from the backend response.
     */
    async function handleLogin({ email, password }) {
        dispatch(setLoading(true))
        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }

    }

    /**
     * Function Name: handleGetme
     * Purpose: Restore the authenticated user session when the app reloads.
     */
    async function handleGetme() {
        dispatch(setLoading(true))
        try {
            const data = await getMe()
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            console.log('====================================');
            console.log(error.message);
            console.log('====================================');
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }
    return {
        handleRegister,
        handleLogin,
        handleGetme
    }
}

export default useAuth

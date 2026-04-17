import { useDispatch } from "react-redux"
import { getMe, login, register } from "../services/authApi.service.js"
import { setLoading, setUser, setError } from "../store/auth.slice.js"


function useAuth() {

    const dispatch = useDispatch()
    async function handleRegister({ name, email, password, role, contact }) {
        dispatch(setLoading(true))
        try {
            const data = await register({ name, email, password, role, contact })
            dispatch(setUser(data.user))
            return data.success
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }

    }
    async function handleLogin({ email, password }) {
        dispatch(setLoading(true))
        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data.success
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }

    }
    async function handleGetme() {
        dispatch(setLoading(true))
        try {
            const data = await getMe()
            dispatch(setUser(data.user))
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

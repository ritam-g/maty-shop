import { useDispatch } from "react-redux"
import { login, register } from "../services/authApi.service"
import { setLoading, setUser, setError } from "../store/auth.store"


function useAuth() {

    const dispatch = useDispatch()
    async function handleRegister({ name, email, password, role, contact }) {
        dispatch(setLoading(true))
        try {
            const data = await register({ name, email, password, role, contact })
            dispatch(setUser(data.user))

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
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }

    }
    return {
        handleRegister,
        handleLogin
    }
}
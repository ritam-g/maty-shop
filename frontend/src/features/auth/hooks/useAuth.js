import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { getMe, login, register } from "../services/authApi.service.js"
import { clearError, setLoading, setUser, setError } from "../store/auth.slice.js"

const mapAuthErrorMessage = (error, action = "login") => {
    const status = error?.response?.status
    const rawMessage = String(error?.response?.data?.message || error?.message || "").toLowerCase()

    if (rawMessage.includes("verify") || rawMessage.includes("unverified")) {
        return "Please verify your account"
    }

    if (status === 401 || status === 403 || rawMessage.includes("unauthorized")) {
        return "Please login to continue"
    }

    if (action === "login") {
        if (
            rawMessage.includes("password is incorrect")
            || rawMessage.includes("user not found")
            || rawMessage.includes("invalid credential")
            || rawMessage.includes("invalid email")
        ) {
            return "Invalid email or password"
        }

        return "Unable to login right now. Please try again."
    }

    if (action === "register") {
        if (rawMessage.includes("already")) {
            return "An account with this email or contact already exists"
        }

        if (rawMessage.includes("all fields are required")) {
            return "Please fill all required fields"
        }

        return "Unable to create your account right now. Please try again."
    }

    return "Something went wrong. Please try again."
}

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
    const handleRegister = useCallback(async ({ name, email, password, role, contact }) => {
        dispatch(setLoading(true))
        dispatch(clearError())
        try {
            const data = await register({ name, email, password, role, contact })
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(mapAuthErrorMessage(error, "register")))
            return null
        } finally {
            dispatch(setLoading(false))
        }

    }, [dispatch])

    /**
     * Function Name: handleLogin
     * Purpose: Log in a user and hydrate Redux auth state from the backend response.
     */
    const handleLogin = useCallback(async ({ email, password }) => {
        dispatch(setLoading(true))
        dispatch(clearError())
        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(mapAuthErrorMessage(error, "login")))
            return null
        } finally {
            dispatch(setLoading(false))
        }

    }, [dispatch])

    /**
     * Function Name: handleGetme
     * Purpose: Restore the authenticated user session when the app reloads.
     */
    const handleGetme = useCallback(async () => {
        dispatch(setLoading(true))
        try {
            const data = await getMe()
            dispatch(setUser(data.user))
            dispatch(clearError())
            return data.user
        } catch (error) {
            const status = error?.response?.status
            dispatch(setUser(null))

            // Missing/expired session on app bootstrap is expected on auth/public pages.
            if (status === 401 || status === 403) {
                dispatch(clearError())
                return null
            }

            dispatch(setError("Session check failed. Please retry."))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])
    return {
        handleRegister,
        handleLogin,
        handleGetme
    }
}

export default useAuth

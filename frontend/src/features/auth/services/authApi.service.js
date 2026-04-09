import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/auth`
    : `http://localhost:3000/api/auth`


const authApi = axios.create({
    baseURL,
    withCredentials: true
})

export async function register({ name, email, password, role, contact}) {
    const response = await authApi.post('/register', { name, email, password, role, contact });
    return response.data
}
export async function login({ email, password }) {
    const response = await authApi.post('/login', { email, password });
    return response.data
}
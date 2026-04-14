import axios from "axios";

const productApi = axios.create({
    baseURL: '/api/product',
    withCredentials: true
})


export async function createProduct(productDetails) {
    const resposne = await productApi.post('/create', productDetails)
    return resposne.data
}
export async function getProduct() {
    const resposne = await productApi.get('/getProduct')
    return resposne.data
}

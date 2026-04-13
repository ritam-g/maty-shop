import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createProduct } from '../controller/product.controller.js'
import { upload } from '../middleware/upload.middleware.js'

const productRouter = Router()

productRouter.post('/create',authMiddleware, upload.array('images', 5),  createProduct)

export default productRouter
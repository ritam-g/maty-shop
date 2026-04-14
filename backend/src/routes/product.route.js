import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createProduct, getUserProduct } from '../controller/product.controller.js'
import { upload } from '../middleware/upload.middleware.js'

const productRouter = Router()
/**LINK - 
 * @description - create product
 * @method - POST
 * @route - /api/product/create
 * @access - private
 */
productRouter.post('/create', upload.array('images', 5), authMiddleware, createProduct)

/**LINK - 
 * @description - get product
 * @method - GET
 * @route - /api/product/getProduct
 * @access - private
 */

productRouter.get('/getProduct',authMiddleware, getUserProduct)

export default productRouter
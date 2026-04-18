import client from "../config/imagekit.config.js";
import productModel from "../model/product.model.js";
import { AppError } from "../utils/AppError.js";

/**
 * Creates a new product with image upload to ImageKit
 * Validates all required fields and uploads product images to cloud storage
 * 
 * @param {Object} productData - The product data object
 * @param {string} productData.user - The user ID (seller) who created the product
 * @param {string} productData.name - The product name
 * @param {string} productData.description - The product description
 * @param {number} productData.price - The product price
 * @param {number} productData.quantity - The available quantity
 * @param {string} productData.currency - The currency code (INR, USD, EUR)
 * @param {Object} productImagesObj - Object containing product images
 * @param {File[]} productImagesObj.productImages - Array of image files to upload
 * @returns {Promise<Object>} The created product document
 * @throws {AppError} If validation fails or image upload fails
 */
export async function createProductService(
    { user, name, description, price, quantity, currency, seller },
    { productImages }
) {

    // ✅ validation
    if (!name || !description || !price || !quantity || !productImages) {
        throw new AppError("All fields are required", 400);
    }
    console.log('validation chekc ');


    // ✅ upload images to ImageKit
    const allImagesWithLink = await Promise.all(
        productImages.map(async (image, index) => {

            const response = await client.files.upload({
                file: image.buffer.toString("base64"), // ✅ correct
                fileName: image.originalname || `image-${index}.jpg`,
                folder: "products"
            });
            console.log('iamge kit url ', response.url);

            return { url: response.url }; // ✅ get URL after upload
        })
    );
    console.log('imges ', allImagesWithLink);

    // ✅ check upload success
    if (!allImagesWithLink || allImagesWithLink.length === 0) {
        throw new AppError("Image upload failed", 500);
    }

    // ✅ create product
    const product = await productModel.create({
        user,
        name,
        description,
        price: {
            amount: Number(price),
            currency
        },
        quantity: Number(quantity),
        title: name,
        images: allImagesWithLink,
        seller
    });

    return product;
}

/**
 * Retrieves all products for a specific user (seller)
 * 
 * @param {string} id - The user ID to fetch products for
 * @returns {Promise<Object[]>} Array of product documents
 * @throws {AppError} If no products are found (404)
 */
export async function getAllProductsService(id) {

    const products = await productModel.find({ seller: id });
    if (products.length === 0) {
        throw new AppError("No products found", 404);

    }
    return products;
}

/**
 * Retrieves one product by its unique ID.
 *
 * @param {string} id - Product document ID.
 * @returns {Promise<Object>} Product document.
 * @throws {AppError} If product is not found.
 */
export async function getProductByIdService(id) {
    const product = await productModel.findById(id);
    if (!product) {
        throw new AppError("Product not found", 404);
    }

    return product;
}
/**  
 * @default plasea add req.file in the newVarents.images
 */
export async function updateProductVarent(productId, UserId, newVarents) {

    if (!productId || !UserId) {
        console.log(productId, UserId);

        throw new AppError("All fields are required", 400)
    }

    const productDetails = await productModel.findOne({ _id: productId, seller: UserId })

    if (!productDetails) {
        throw new AppError("Product not found", 404)
    }

    // image will go to imagekite and give use url 
    let images = []
    if (newVarents.images.length <= 0) {
        throw new AppError("All fields are required", 400)
    }

    for (const img of newVarents.images) {
        const response = await client.files.upload({
            file: img.buffer.toString("base64"),
            fileName: img.originalname || `image-${Date.now()}.jpg`,
            folder: "products/varents"
        });

        images.push({ url: response.url }); // ✅ real value
    }

    // ! debug the the images
    // console.log('====================================');
    // console.log(newVarents);
    // console.log('====================================');
    productDetails.variants.push({
        images,
        stock: newVarents.stock,
        price: {
            amount: Number(newVarents.price) || productDetails.price.amount,
            currency: newVarents.currency || "INR"
        },
        attributes: JSON.parse(newVarents.attributes || "{}")

    })
    await productDetails.save()
    return productDetails
}


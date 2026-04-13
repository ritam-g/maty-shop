import client from "../config/imagekit.config.js";
import productModel from "../model/product.model.js";
import { AppError } from "../utils/AppError.js";

export async function createProductService(
    { user, name, description, price, quantity, currency },
    { productImages }
) {

    // ✅ validation
    if (!name || !description || !price || !quantity || !productImages) {
        throw new AppError("All fields are required", 400);
    }

    // ✅ upload images to ImageKit
    const allImagesWithLink = await Promise.all(
        productImages.map(async (image, index) => {

            const response = await client.files.upload({
                file: image.buffer.toString("base64"), // ✅ correct
                fileName: image.originalname || `image-${index}.jpg`,
                folder: "products"
            });

            return response.url; // ✅ get URL after upload
        })
    );

    // ✅ check upload success
    if (!allImagesWithLink || allImagesWithLink.length === 0) {
        throw new AppError("Image upload failed", 500);
    }

    // ✅ create product
    const product = await productModel.create({
        user,
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        currency,
        images: allImagesWithLink
    });

    return product;
}
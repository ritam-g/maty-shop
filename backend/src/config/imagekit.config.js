import ImageKit from '@imagekit/nodejs'

/**
 * ImageKit client configuration for image upload and management
 * Uses environment variables for authentication credentials
 * 
 * @see {@link https://docs.imagekit.io/} for ImageKit documentation
 */
const client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

export default client

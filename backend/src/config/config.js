import { config } from 'dotenv'

config()

if (process.env.MONGO_URL === undefined) throw new Error('MONGO_URL is not defined')
if (process.env.JWT_SECRET === undefined) throw new Error('JWT_SECRET is not defined')
if (process.env.CLIENT_ID === undefined) throw new Error('CLIENT_ID is not defined')
if (process.env.CLIENT_SECRET === undefined) throw new Error('CLIENT_SECRET is not defined')
if (process.env.IMAGEKIT_PUBLIC_KEY === undefined) throw new Error('IMAGEKIT_PUBLIC_KEY is not defined')
if (process.env.IMAGEKIT_PRIVATE_KEY === undefined) throw new Error('IMAGEKIT_PRIVATE_KEY is not defined')
if (process.env.IMAGEKIT_URL_ENDPOINT === undefined) throw new Error('IMAGEKIT_URL_ENDPOINT is not defined')


export const AppConfig = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    React_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT
}
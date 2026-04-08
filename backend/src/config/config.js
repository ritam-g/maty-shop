import { config } from 'dotenv'

config()

if (process.env.MONGO_URL === undefined) throw new Error('MONGO_URL is not defined')

export const AppConfig = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
}
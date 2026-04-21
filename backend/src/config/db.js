import mongoose from 'mongoose';
async function dbConnection() {
    try {
        // it will change
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        });

        console.log('Database connected');
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
}

export default dbConnection
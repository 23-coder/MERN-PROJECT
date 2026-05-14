import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

let isConnected = false

const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB already connected')
        return
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables')
    }

    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })

        isConnected = true
        console.log(`MongoDB connected: ${conn.connection.host}`)

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB error:', err)
        })

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected')
            isConnected = false
        })

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected')
            isConnected = true
        })
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        process.exit(1)
    }
}

export default connectDB

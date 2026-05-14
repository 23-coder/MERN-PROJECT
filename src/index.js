import dotenv from "dotenv"
dotenv.config()

import connectDB from "./db/index.js"
import { app } from './app.js'

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    process.exit(1)
})

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason)
    process.exit(1)
})

connectDB()
    .then(() => {
        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`)
        })

        const shutdown = (signal) => {
            console.log(`${signal} received — shutting down gracefully`)
            server.close(() => {
                console.log('HTTP server closed')
                process.exit(0)
            })
        }

        process.on('SIGTERM', () => shutdown('SIGTERM'))
        process.on('SIGINT', () => shutdown('SIGINT'))
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err)
        process.exit(1)
    })

import mongoose from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const DB_STATES = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }

const healthcheck = asyncHandler(async (_req, res) => {
    const dbState = mongoose.connection.readyState
    const isHealthy = dbState === 1

    const data = {
        status: isHealthy ? 'ok' : 'degraded',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
            status: DB_STATES[dbState] || 'unknown',
        }
    }

    return res
        .status(isHealthy ? 200 : 503)
        .json(new ApiResponse(
            isHealthy ? 200 : 503,
            data,
            isHealthy ? 'Server is healthy' : 'Server is degraded'
        ))
})

export { healthcheck }

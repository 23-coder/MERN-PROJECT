import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"
import compression from "compression"

const app = express()

// Trust Railway/Vercel/Render reverse proxy so express-rate-limit reads the correct client IP
app.set('trust proxy', 1)

// Secure HTTP headers
app.use(helmet())

// CORS — supports comma-separated origins in CORS_ORIGIN env var
app.use(cors({
    origin: function (origin, callback) {
        const allowed = (process.env.CORS_ORIGIN || '*').split(',').map(o => o.trim())
        if (!origin || allowed.includes('*') || allowed.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

// Global rate limit: 200 requests per 15 minutes
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { statusCode: 429, message: 'Too many requests, please try again later.', success: false }
}))

// Stricter limit on auth routes: 20 per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { statusCode: 429, message: 'Too many auth attempts, please try again later.', success: false }
})

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Block NoSQL injection attacks
app.use(mongoSanitize())

// Gzip responses
app.use(compression())

// Dev-only request logger (no extra dependency)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.url}`)
        next()
    })
}

// Routes
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", authLimiter, userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// 404 — must come after all routes
app.use((_req, res) => {
    res.status(404).json({ statusCode: 404, message: 'Route not found', success: false })
})

// Global error handler — must be last
app.use((err, req, res, _next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack)
    }

    return res.status(statusCode).json({
        statusCode,
        message,
        success: false,
        errors: err.errors || [],
    })
})

export { app }

import express from 'express'
import AuthRouter from './modules/auth/auth.routes.js'
import pollRouter from './modules/Poll/poll.routes.js'
import ApiError from './common/utils/api-error.js'
const app = express()
app.use(express.json())



app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/Polls', pollRouter)

app.get('/', (req, res) => {
      res.send('Hello World!from Express')
})



app.all("{*path}", (req, res, next) => {
      next(ApiError.notfound(`Route ${req.originalUrl} not found`));
});

// global error  handler
// Global Error Handler
app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(statusCode).json({
            success: false,
            message: message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
      });
});

export default app;
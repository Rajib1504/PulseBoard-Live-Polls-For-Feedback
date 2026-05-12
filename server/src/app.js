import express from 'express'
import AuthRouter from './modules/auth/auth.routes.js'
const app = express()
app.use(express.json())



app.use('/api/v1/auth',AuthRouter)
app.get('/', (req, res) => {
      res.send('Hello World!from Express')
})

export default app;
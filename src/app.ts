import express, { Express } from "express"
import dotenv from "dotenv"
import router from './router/routes'
import cookieParser from 'cookie-parser'

dotenv.config()

const app: Express = express();

app.use(express.json())
app.use(cookieParser())
app.use('/', router)

export default app

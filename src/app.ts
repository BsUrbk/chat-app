import express, { Express } from "express"
import dotenv from "dotenv"
import router from './router/routes'

dotenv.config()

const app: Express = express();

app.use(express.json())
app.use('/', router)

app.listen(process.env.PORT || 3000, ()=>{console.log(`Up and running at ${process.env.HOSTNAME}:${process.env.PORT}`)})